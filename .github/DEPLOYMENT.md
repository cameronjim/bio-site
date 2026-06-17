# Deployment

Auto-deploy on merge to `main`, modeled on the fantasy-app pipeline.

## The flow

```
local change  →  push to a branch  →  open a PR  →  CI runs on the PR
                                                         │ (green)
                                                    merge to main
                                                         │
                                              CI runs again on main
                                                         │ (green)
                                          Deploy workflow fires automatically
                                                         │
                       ┌─────────────────────────────────┼─────────────────────────────┐
                  Lambda code                        Frontend                      Smoke test
        update-function-code on the 3              build → S3 sync →           hit the live API
        bio-site-* functions                       CloudFront invalidation     + frontend root
```

If CI fails, **nothing deploys** — prod stays exactly as it was.

## What the workflows do

- **`.github/workflows/ci.yml`** — runs on every push to `main` and every PR
  into `main`. Builds the frontend (`tsc` typecheck + `vite build`) and the
  Lambdas (compiles the TypeScript `admin` function, syntax-checks the
  `validate`/`redirect` functions). This is the gate.
- **`.github/workflows/deploy.yml`** — fires via `workflow_run` *after* CI
  succeeds on `main`. Three jobs:
  - **deploy-lambdas** — zips each function and runs `aws lambda
    update-function-code` (code only — never touches env vars, IAM, API
    Gateway, DynamoDB, or domains). `--publish` snapshots a version each time
    for rollback.
  - **deploy-frontend** — `npm run build`, syncs `dist/` to the S3 bucket with
    correct cache headers, invalidates CloudFront.
  - **smoke-test** — curls the live validate API and the frontend root.

This is a **code-only** pipeline. Infrastructure (new Lambda functions, env
vars, API routes, DynamoDB, domains) is still managed out-of-band — the
workflow only updates the code of resources that already exist.

## One-time setup

### Already done for you (in AWS account `915946341842`)

- The GitHub OIDC identity provider already existed (created for fantasy-app)
  and is reused — nothing to create.
- An IAM role **`bio-site-deploy`** was created:
  - **ARN:** `arn:aws:iam::915946341842:role/bio-site-deploy`
  - Trusts GitHub OIDC, restricted to `repo:cameronjim/bio-site:ref:refs/heads/main`.
  - Least-privilege inline policy `bio-site-deploy-policy`: `UpdateFunctionCode`/
    `PublishVersion`/`GetFunction` on the three `bio-site-*` functions, S3
    read/write on `cameronjim.com-site`, and `CreateInvalidation` on the one
    CloudFront distribution. Nothing else.

### You must do this (GitHub UI — `gh` CLI isn't installed here)

1. Repo → **Settings → Secrets and variables → Actions → Variables tab →
   New repository variable**:

   | Name                  | Value                                                |
   |-----------------------|------------------------------------------------------|
   | `AWS_DEPLOY_ROLE_ARN` | `arn:aws:iam::915946341842:role/bio-site-deploy`     |

   That's the only value the workflows read from GitHub. The region, function
   names, bucket, and CloudFront ID are non-secret and hardcoded in the
   workflows.

2. *(Recommended)* Repo → **Settings → Branches → Add branch protection rule**
   for `main`:
   - Require status checks to pass before merging.
   - Mark **`Frontend (typecheck + build)`** and **`Lambdas (typecheck +
     build)`** as required.

   Until this is set, the CI checkmark is informational and you could merge a
   red PR.

### Verify it works

1. Open a tiny PR (change a comment). Watch **CI** run on the PR; Deploy should
   **not** run.
2. Merge it. Watch **CI** run on `main`, then **Deploy** start automatically.
3. The **smoke-test** job confirms the live API and site respond.

## Resource reference

| Thing                  | Value                                            |
|------------------------|--------------------------------------------------|
| Region                 | `us-east-1`                                       |
| CloudFormation stack   | `bio-site` (SAM-managed)                          |
| Lambda functions       | `bio-site-validate`, `bio-site-redirect`, `bio-site-admin` |
| Frontend S3 bucket     | `cameronjim.com-site`                             |
| CloudFront distribution| `E3TXY6MC9HGVY3` (`www.cameronjim.com`)           |

## Rollback

- **Lambda:** Console → Lambda → the function → **Versions** → an earlier
  published version → repoint as needed. (Each deploy publishes a version.)
- **Frontend:** Re-run a previous good **Deploy** run (Actions → Deploy →
  pick the run → **Re-run jobs**), which re-syncs that commit's build.

## Notes / gotchas

- **AWS SDK is runtime-provided.** None of the functions bundle `@aws-sdk` —
  the `nodejs20.x` runtime supplies it (the `admin` function already worked
  this way). If you ever bump the functions to a runtime that drops the bundled
  SDK (nodejs22+), add a bundling step.
- **No `package-lock.json`** is committed (it's gitignored), so the workflows
  use `npm install`, not `npm ci`. Builds aren't fully pinned. If you want
  reproducible installs, un-ignore and commit the lock files and switch to
  `npm ci`.
- **Secrets live in the live Lambda env vars** (`ADMIN_PASSWORD`, `IP_SALT` on
  `bio-site-admin`). The code-only deploy never reads or overwrites them, so
  they're safe. Consider rotating `ADMIN_PASSWORD` and setting a real `IP_SALT`
  at some point — manage those in the Lambda console (or move to IaC later).
