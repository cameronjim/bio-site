# Deployment

Two chained GitHub Actions workflows. A red build can't reach production.

## CI — `.github/workflows/ci.yml`

Runs on every push to `main` and every pull request into `main`.

| Job | Steps |
|---|---|
| `frontend` | `npm ci` → `npm run build` (`tsc` typecheck + Vite build) |
| `lambdas` | Compiles the admin Lambda; syntax-checks the two ESM handlers with `node --check` |

There is no separate lint or test step yet — **`npm run build` is the gate**.

Concurrency is `cancel-in-progress: true`, so pushing again to the same branch
cancels the in-flight run.

## Deploy — `.github/workflows/deploy.yml`

Triggered by `workflow_run` *after* CI completes on `main`. Every job is guarded by
`github.event.workflow_run.conclusion == 'success'`, so a failed CI run deploys
nothing.

### 1. `deploy-lambdas`

Builds the admin Lambda, zips each function flat (`zip -j`, so `index.handler`
resolves at the archive root), then:

```bash
aws lambda update-function-code --function-name bio-site-… --zip-file … --publish
```

This updates **code only**. Environment variables, IAM roles, API Gateway routes,
DynamoDB tables, and domains are never touched. `--publish` snapshots a numbered
version, which is what makes rollback possible.

### 2. `deploy-frontend`

Builds the SPA and syncs it to S3 with a split cache policy:

| Files | `Cache-Control` | Why |
|---|---|---|
| `assets/*` | `public, max-age=31536000, immutable` | Vite content-hashes these; the name changes when the content does |
| everything else | `public, max-age=0, must-revalidate` | `index.html`, `resume.pdf`, `robots.txt` must never be stale |

Then invalidates CloudFront with `--paths "/*"`, so updated root files (including
`resume.pdf`) go live immediately rather than serving from cache.

### 3. `smoke-test`

Runs after both deploy jobs:

1. Calls the live validate API with a bogus token and asserts the response has a
   `valid` field — proving API Gateway and the Lambda are alive.
2. Fetches the real page, extracts **every hashed asset it references**, and asserts
   each returns `200`.

Step 2 matters: checking only for the `#app` mount node would pass even on a total
white-screen, because that node is in the static HTML regardless. A deployed
`index.html` whose JS bundle 404s is the actual failure mode, and this catches it.

## Pipeline details

- **Deploys use the tested commit.** Both jobs check out
  `github.event.workflow_run.head_sha`, not whatever is newest on `main`.
- **Deploys don't overlap.** `cancel-in-progress: false` queues back-to-back merges
  rather than cancelling mid-deploy and leaving a Lambda half-updated.
- **Actions are pinned to commit SHAs**, not mutable tags, so a compromised or
  retagged upstream action can't silently change what runs.
- **No AWS keys exist.** Authentication is GitHub OIDC: the workflow requests an
  identity token (`permissions: id-token: write`) and assumes an IAM role whose trust
  policy is scoped to this repository on `main`.

## Rollback

| Target | How |
|---|---|
| Lambda | Console → the function → Versions → repoint to a previous published version |
| Frontend | Actions → Deploy → an earlier successful run → **Re-run jobs** |

## Infrastructure changes

The pipeline is **code-only**. Infrastructure was provisioned with AWS
SAM/CloudFormation and the template isn't committed, so changes to API routes,
DynamoDB tables, domains, or Lambda environment variables are made out-of-band in
AWS — they will not appear in a deploy.

## Configuration reference

### GitHub repository variables

Settings → Secrets and variables → Actions → **Variables**.

| Variable | Purpose |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | IAM role the workflow assumes via OIDC |
| `S3_BUCKET` | Frontend bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | Distribution to invalidate |

Infrastructure identifiers are intentionally kept out of the repository.

### Lambda environment variables

Set in AWS, per function.

| Variable | Used by | Default | Notes |
|---|---|---|---|
| `ADMIN_PASSWORD` | admin | **required** | No default — a missing value disables the API |
| `SESSION_SECRET` | admin | `ADMIN_PASSWORD` | HMAC key for session tokens |
| `TOKENS_TABLE` | all | `Tokens` | |
| `EVENTS_TABLE` | all | `TokenEvents` | |
| `ALLOWED_ORIGIN` | validate, admin | site origin | CORS allow-list; never `*` |
| `SITE_URL` | redirect, admin | site origin | Base for generated links and redirects |
| `IP_SALT` | validate, redirect | *(none)* | Unset ⇒ `ipHash` is stored as `null` |
| `EVENTS_TTL_DAYS` | validate, redirect | `180` | Analytics retention window |

### One-time setup

The deploy role is created once in AWS:

1. Register GitHub's OIDC provider (`token.actions.githubusercontent.com`) in IAM —
   once per AWS account.
2. Create a role with a web-identity trust policy scoped to
   `repo:<owner>/<repo>:ref:refs/heads/main`.
3. Attach a least-privilege inline policy: `UpdateFunctionCode` on the three
   `bio-site-*` functions, read/write on the frontend bucket, and
   `CreateInvalidation` on the one distribution.
4. Add the three repository variables above.
