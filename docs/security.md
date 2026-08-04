# Security

What this app protects, how — and what it deliberately doesn't.

## The most important limit

**The token gate is client-side.**

Token validation decides whether the portfolio *renders*. It does not decide whether
bytes are reachable. The compiled JavaScript bundle and everything in `public/`
(including `resume.pdf`) are served by CloudFront to anyone who requests the URL,
with no token involved.

Practically:

- Portfolio content lives in the JS bundle, so a determined visitor with the bundle
  URL can read it.
- `www.cameronjim.com/resume.pdf` is directly fetchable.

Treat the gate as **access control against casual discovery, plus per-link
analytics** — not as a guarantee of confidentiality. Don't put anything in this app
you wouldn't hand to a stranger.

Closing that gap would mean moving the gate to the edge (CloudFront signed
URLs/cookies, or a Lambda@Edge / CloudFront Function that checks the token before
serving any object).

## Token privacy

| Token type | Privacy |
|---|---|
| Random (12 chars, ~71 bits) | Unguessable — this is what makes a link private |
| Custom slug (`/dev`) | **Guessable by design.** Convenient, not private |

Use random tokens for anything sensitive. Vanity slugs are for links you don't mind
someone stumbling onto.

## Admin API

- **Fails closed.** `ADMIN_PASSWORD` is read via a helper that throws at module load,
  so a missing environment variable disables the API instead of falling back to a
  default password.
- **Constant-time comparison.** Both sides are hashed to fixed-length digests before
  `timingSafeEqual`, so neither length nor a matching prefix leaks through timing.
- **Short-lived signed sessions.** The browser stores an HMAC-signed session token
  (8-hour TTL), never the raw password. Signature and expiry are verified server-side
  on every request.
- **Pinned CORS.** `ALLOWED_ORIGIN` defaults to the real site origin, never `*`. A
  wildcard on an authenticated endpoint would let any page call the API with the
  visitor's credentials.
- **Input validation.** Campaign length, expiry range, and slug format are all bounded
  server-side; slug creation is a conditional write, so links can't be overwritten.

## Analytics data

- IPs are hashed with HMAC-SHA256 keyed to a secret salt, then truncated. With no
  salt configured the code stores `null` rather than a guessable hash — the IPv4
  space is small enough that an unsalted digest is trivially reversible.
- Events self-delete via DynamoDB TTL (default 180 days).
- Handlers never log the full request event, because tokens travel in the query
  string or path and would otherwise land in CloudWatch in plaintext.

## Secrets and infrastructure

- The admin password, session secret, and IP salt exist **only** as Lambda
  environment variables in AWS. Nothing secret is committed, and the frontend bundle
  contains no credentials.
- AWS account identifiers, the S3 bucket name, and the CloudFront distribution ID are
  supplied through GitHub repository variables rather than being hardcoded in the
  repo.
- **No long-lived AWS keys.** GitHub Actions authenticates with OIDC, assuming a role
  whose trust policy is scoped to this repository on `main`.
- The deploy role is least-privilege: update code on the three `bio-site-*` functions,
  read/write the one frontend bucket, invalidate the one distribution. Nothing else.

## If a token leaks

Delete it from the admin dashboard — the row is removed from DynamoDB and the link
stops working on the next request. Setting `revoked: true` on the item has the same
effect. Neither requires a deploy.
