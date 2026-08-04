# Token system

Every visit to the portfolio requires a token. This document covers how tokens are
generated, validated, and retired.

## URL shapes

Three URLs lead to the same gated portfolio:

| URL | Handled by | Notes |
|---|---|---|
| `www.cameronjim.com/{token}` | React app, `/:token` route | Vanity/root-path links, e.g. `/dev`. Current default |
| `www.cameronjim.com/t/{token}` | React app, `/t/:token` route | Original explicit token path |
| `go.cameronjim.com/{token}` | Redirect Lambda | Short-link domain; 302s to the site and logs its own event |

The `/:token` route is declared *after* the static routes, so `/admin` and
`/expired` always win. Slugs that would collide with them are rejected at creation
(see [Reserved names](#reserved-names)).

## Generating a token

### Random tokens (default)

12 characters from a 62-character alphabet, drawn from `crypto.randomBytes` with
**rejection sampling**:

```ts
const limit = Math.floor(256 / chars.length) * chars.length;
// bytes at or above `limit` are discarded rather than reduced with %
```

A plain `byte % 62` would make the first few letters of the alphabet slightly more
likely, because 256 isn't a multiple of 62. Discarding out-of-range bytes keeps
every character equally probable. At 12 characters that's roughly **71 bits of
entropy** — not guessable.

### Custom slugs

A vanity name like `dev` produces `www.cameronjim.com/dev`. Slugs are lower-cased
(so `/Dev` and `/dev` can't become two different links) and must match
`^[a-z0-9_-]{1,64}$`.

Two guards apply:

**Reserved names.** `admin`, `expired`, `preview`, `t`, `api`, and `assets` are
rejected with a `400`. Each would be shadowed by a real client route or the
static-asset namespace, producing a link that silently renders the wrong page
instead of the portfolio.

**No clobbering.** The write is conditional:

```ts
ConditionExpression: 'attribute_not_exists(#t)'
```

Creating a slug that already exists returns `409 That link name is already taken`
rather than overwriting — and stealing — an existing link.

> Custom slugs are **guessable by design**. A random token is private because
> nobody can guess it; `/dev` is not. Use random tokens for anything sensitive.

## Validating a token

`src/pages/TokenGate.tsx` calls
`GET https://api.cameronjim.com/validate?token=…`. The Lambda:

1. Fetches the item from `Tokens`.
2. Rejects it if `revoked` is set, or if `expiresAt` is in the past.
3. Logs a `validate` event to `TokenEvents`.
4. Returns `{ valid, campaign, variant, destinationPath }`.

On `valid: true` the portfolio renders; otherwise the user is redirected to
`/expired`, which explains nothing about why.

### One validation per visit

The fetch is latched with a `useRef` so it fires exactly once per token:

```tsx
if (validatedTokenRef.current === token) return
validatedTokenRef.current = token
```

Without this, React StrictMode's double-invoked effects would fire a second
validation and log a duplicate event, inflating the view count for a single visit.

## Expiry and revocation

| Mechanism | Effect |
|---|---|
| `expiresAt` in the past | Rejected at validation. Also the DynamoDB TTL attribute, so the row eventually self-deletes |
| Indefinite link | `expiresAt` is omitted entirely — no expiry check, no TTL, never auto-deleted |
| Delete from dashboard | Row is removed; the link stops working immediately |
| `revoked: true` | Rejected at validation, even before expiry |

Expiring links accept 1–365 days. Because DynamoDB TTL deletion is best-effort and
can lag by up to ~48 hours, expiry is *also* checked on every request — the row
being present doesn't mean the token is still valid.

## Event types

A single visit through a short link produces **two** records:

| Event | Written by | Meaning |
|---|---|---|
| `open_go` | Redirect Lambda | The short link was opened |
| `validate` | Validate Lambda | The portfolio actually loaded |

The dashboard's view count deliberately counts only `validate` events. Counting
both would double every visit that arrived through `go.cameronjim.com`.
