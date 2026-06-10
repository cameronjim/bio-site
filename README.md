# bio-site

A private, token-gated personal portfolio running on a fully serverless AWS stack.

The site isn't publicly linkable. Visitors reach it through a unique access token
created from a built-in admin dashboard, so every shared link can be tracked,
expired, or revoked individually. Merging to `main` builds, deploys, and
smoke-tests the whole thing automatically.

## How access works

1. In the admin dashboard, create a link for a named campaign
   (e.g. `Google SWE Intern 2026`).
2. You get a URL containing an access token — a random 12-character token, or a
   custom slug like `/dev`.
3. Share it. When opened, the token is validated server-side and the visit is
   logged against that campaign.
4. Links expire on a schedule you choose (or never), and deleting one kills it
   instantly.

Invalid, expired, or deleted tokens land on a neutral `/expired` page.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript (strict), Vite 7, React Router 7 |
| Styling | Tailwind CSS v4, daisyUI 5 (light / dark / custom theme) |
| Compute | AWS Lambda (Node 20) — validate, redirect, admin |
| API | Amazon API Gateway (HTTP API) |
| Data | Amazon DynamoDB (`Tokens`, `TokenEvents`, both TTL-enabled) |
| Hosting | Amazon S3 + CloudFront |
| DNS / TLS | Amazon Route 53 + ACM |
| Infrastructure | AWS SAM / CloudFormation |
| CI/CD | GitHub Actions with AWS OIDC federation |

## How it fits together

```
                    ┌──────────────────────┐
   visitor ────────▶│  CloudFront + S3     │   React SPA (static)
                    │  www.cameronjim.com  │
                    └──────────┬───────────┘
                               │  token in the URL
                               ▼
                    ┌──────────────────────┐
                    │  API Gateway         │
                    │  api.cameronjim.com  │
                    └──────────┬───────────┘
                               ▼
              ┌────────────────────────────────┐
              │  Lambda: validate │ admin      │
              └────────────────┬───────────────┘
                               ▼
                    ┌──────────────────────┐
                    │  DynamoDB            │
                    │  Tokens │ TokenEvents│
                    └──────────────────────┘
```

The React app renders the portfolio only after the **validate** Lambda confirms the
token. A separate **redirect** Lambda powers short links on `go.cameronjim.com`, and
the **admin** Lambda backs the dashboard at `/admin`.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173 — renders the portfolio, no token needed
npm run build    # tsc typecheck + vite production build  ← the CI gate
npm run preview  # serve the production build locally
```

`/` and `/preview` render the portfolio without a token in development only; both
are compiled out of production builds. See [docs/development.md](docs/development.md).

## CI/CD

Two chained GitHub Actions workflows:

- **CI** (`ci.yml`) runs on every push to `main` and every PR — typechecks and
  builds the frontend and all three Lambdas.
- **Deploy** (`deploy.yml`) runs only after CI passes on `main`. It updates the
  Lambda code, syncs the frontend to S3 with split cache headers, invalidates
  CloudFront, and runs a post-deploy smoke test against the live site.

Deploys authenticate with **GitHub OIDC** — no long-lived AWS keys exist. They ship
code only and never touch API Gateway, DynamoDB, domains, or environment variables.
Details in [docs/deployment.md](docs/deployment.md).

## Repository layout

```
src/                  # React app — pages/, components/, config/, assets/
lambda/               # AWS handlers — validate/, redirect/, admin/
public/               # served verbatim: resume.pdf, favicon, robots.txt
docs/                 # in-depth documentation
.github/workflows/    # ci.yml, deploy.yml
CLAUDE.md             # engineering standards for this repo
```

## Documentation

| Document | Contents |
|---|---|
| [Architecture](docs/architecture.md) | AWS resources, request flows, Lambda functions, data model |
| [Token system](docs/tokens.md) | Token generation, validation, expiry, vanity slugs |
| [Admin dashboard](docs/admin.md) | Auth model, features, analytics and privacy |
| [Deployment](docs/deployment.md) | CI/CD pipeline, configuration reference, rollback |
| [Development](docs/development.md) | Local setup, routing, theming, conventions |
| [Security](docs/security.md) | Security model and its intentional limits |

> **Note:** the token gate controls whether the portfolio *renders* — the compiled
> bundle and files in `public/` are served by CloudFront without a token. See
> [docs/security.md](docs/security.md) before putting anything sensitive in the app.
