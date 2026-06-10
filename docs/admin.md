# Admin dashboard

Served at `/admin` and backed by the `bio-site-admin` Lambda. It's where links are
created, revoked, and measured.

## Authentication

The dashboard is protected by a single password that lives **only** in the Lambda's
environment — it is never committed, bundled, or shipped to the browser.

```
1. You submit the password  ──▶  GET /admin/verify
2. Lambda compares it in constant time
3. Lambda returns a signed session token:  v1.<expiry>.<HMAC-SHA256>
4. Browser stores that token in sessionStorage and sends it as
   Authorization: Bearer …  on every later request
```

Design decisions worth knowing:

**The password is never persisted.** Only the short-lived session token (8-hour TTL)
is stored, so a browser compromise doesn't leak a long-lived credential. The session
token is signed with `SESSION_SECRET` (falling back to the admin password) and
verified server-side on every request — expiry included.

**Comparison is constant-time.** Both values are hashed to fixed-length digests
before `timingSafeEqual`, so neither the length nor a matching prefix of the
password leaks through response timing.

**The API fails closed.** `ADMIN_PASSWORD` is read through a `requireEnv` helper
that throws at module load. A missing variable bricks the function rather than
silently falling back to a default password.

**CORS is pinned.** `ALLOWED_ORIGIN` defaults to the real site origin, never `*` —
a wildcard on an authenticated endpoint would let any site call it with the
visitor's credentials.

## Features

### Create Links

| Field | Notes |
|---|---|
| Campaign name | Required, ≤ 200 characters |
| Expires in (days) | 1–365; the field can be cleared, which disables submit |
| Never expires | Creates an indefinite link and disables the days field |
| Custom link | Optional vanity slug; input is sanitised to `[a-z0-9_-]` as you type |

The submit button stays disabled until the form is valid. Server-side rejections
(name taken, reserved slug, out-of-range expiry) surface verbatim rather than as a
generic failure.

### Active Links

Every link with its full URL, created and expiry dates ("Never" for indefinite
links), a copy button, and a delete button. Deleting removes the row from DynamoDB,
so the link stops working immediately.

### Analytics

Per-link view counts with an expandable timeline of individual events.

The count reflects **`validate` events only**. One visit through a short link writes
both an `open_go` and a `validate` record, so counting every event type would report
two views for a single visitor. See [tokens.md](tokens.md#event-types).

## Analytics and privacy

Deliberately minimal — no third-party analytics, no cookies, no fingerprinting.

- **IPs are never stored raw.** They're hashed with HMAC-SHA256 keyed to a secret
  salt, then truncated. If `IP_SALT` is unset the code stores `null` rather than a
  guessable hash — the IPv4 space is small enough to brute-force an unsalted digest,
  which would make "anonymised" data reversible.
- **Events expire automatically** via DynamoDB TTL, defaulting to 180 days
  (`EVENTS_TTL_DAYS`).
- **Tokens are never logged.** The handlers deliberately avoid logging the full
  request event, because the token travels in the query string or path and would
  otherwise sit in CloudWatch in plaintext.
- **Search engines are excluded** via `robots.txt` and `noindex, nofollow` meta tags.

What *is* recorded per event: which token, when, the event type, the user-agent
string, a salted IP hash, and the referrer if present.
