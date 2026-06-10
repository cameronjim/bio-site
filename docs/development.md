# Development

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc typecheck + vite production build  ← must pass before committing
npm run preview  # serve the production build locally
```

Node 20 is what CI and the Lambdas use.

## Working without a token

Two things make local development painless:

**Dev-only preview routes.** `/` and `/preview` render the portfolio directly, no
token required. They're guarded by `import.meta.env.DEV`, so Vite strips them from
production builds — in production `/` still falls through to the catch-all.

**Dev API proxy.** The production API only allows the live site's origin, so calling
it directly from `localhost` fails CORS. `vite.config.ts` proxies `/api/*` to the
real API server-side, which keeps browser requests same-origin:

```ts
server: {
  proxy: {
    '/api': {
      target: 'https://api.cameronjim.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

`src/config/api.ts` and `src/pages/Admin.tsx` pick their base URL from
`import.meta.env.DEV`, so this is automatic. It's also what makes `/admin` work
locally.

> There is no local backend. Dev talks to the **live production API and DynamoDB** —
> links you create or delete while developing are real.

## Routes

Defined in `src/App.tsx`, which stays a pure route table with no logic.

| Route | Component | Notes |
|---|---|---|
| `/t/:token` | `TokenGate` | Validates, then renders the portfolio |
| `/:token` | `TokenGate` | Vanity slugs; declared after the static routes so they win |
| `/admin` | `Admin` | Dashboard |
| `/expired` | `Expired` | Neutral rejection page |
| `*` | `Expired` | Catch-all |
| `/` and `/preview` | `Portfolio` | **Dev only** |

Adding a static top-level route? Declare it **above** `/:token`, and add the slug to
`RESERVED_SLUGS` in `lambda/admin/index.ts` so a link can't be created that the new
route would shadow.

## Project structure

```
index.html              # app shell: meta tags, theme bootstrap script, #app mount
src/
  main.tsx              # entry: StrictMode > BrowserRouter > App
  App.tsx               # route table only
  index.css             # the only stylesheet: Tailwind import + daisyUI themes
  config/api.ts         # network layer: base URL, typed helpers, response types
  components/           # Portfolio, ThemeToggle, PiedPiperPlayer
  pages/                # TokenGate, Admin, Expired — one per route
  assets/               # imported images, hashed by Vite
lambda/
  validate/ redirect/   # plain ESM handlers
  admin/                # TypeScript, compiled with tsc
public/                 # served verbatim at the site root
```

New images go in `src/assets/` and are `import`ed so Vite content-hashes them.
`public/` is only for files that need a fixed public URL, like `resume.pdf`.

## Theming

Three daisyUI themes are configured in `src/index.css`:

| Theme | Role |
|---|---|
| `piedpiper` | Custom theme, and the default |
| `lofi` | Light |
| `business` | Dark |

A small inline script in `index.html` applies the stored theme **before** React
paints, which prevents a flash of the wrong theme on load. The selection persists in
`localStorage`, so changing the default won't affect a browser that has already
chosen one — check in a private window.

Style with daisyUI semantic tokens (`bg-base-100`, `text-base-content`,
`text-primary`, `border-base-300`), never raw colors. That's what lets all three
themes work without per-component overrides.

## Conventions

Full standards live in [`CLAUDE.md`](../CLAUDE.md). The short version:

- Components are named function declarations with a default export at the bottom.
- No semicolons in `src/`; semicolons in `lambda/` (Node convention). 2-space indent.
- Utility-first styling; `src/index.css` is the only stylesheet.
- Comments explain **why**, not what.
- Guard one-shot effects (anything that fires a network call) with a `useRef` latch —
  React StrictMode double-invokes effects in development.

## Gotchas

- **Vite config changes need a dev-server restart** — they aren't hot-reloaded.
- **Lazy images need `width`/`height`.** Without reserved space they pop in and shift
  the layout, which breaks anchor navigation and scroll-spy mid-scroll.
- **Audio can't autoplay.** `PiedPiperPlayer` drives a hidden YouTube IFrame player
  and requires a click; browsers block unmuted autoplay. The UI and playback logic
  are ours, so no copyrighted audio is hosted in this repo.
