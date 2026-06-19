# AGENTS.md

Engineering standards for **bio-site** — a token-gated personal portfolio. This
file is the source of truth for structure, style, and conventions. Match it when
adding or changing code. When in doubt, copy the patterns already in the file you
are editing.

---

## 1. Project overview

A private React + TypeScript single-page app, gated behind unique access tokens,
backed by AWS Lambda. The frontend is built with Vite and styled with Tailwind CSS
v4 + daisyUI. Three Lambda functions handle token validation, short-link
redirects, and an admin API. Auto-deploys to AWS on merge to `main` via GitHub
Actions + OIDC.

**Stack:** React 19, TypeScript (strict), Vite 7, Tailwind v4, daisyUI 5,
React Router 7, AWS Lambda (Node 20), API Gateway, DynamoDB, CloudFront, S3.

## 2. Commands

```bash
npm run dev      # Vite dev server — http://localhost:5173 (root renders the portfolio in dev)
npm run build    # tsc typecheck + vite production build  ← must pass before every commit
npm run preview  # serve the production build locally
```

There is no separate lint/test step yet. **`npm run build` is the gate** — it runs
`tsc` (typecheck, no emit) then `vite build`. Never commit code that fails it.

## 3. Repository structure

```
index.html              # app shell: <head> meta, theme bootstrap script, #app mount
src/
  main.tsx              # React entry: StrictMode > BrowserRouter > App
  App.tsx               # route table only — no UI, no logic
  index.css             # the ONLY stylesheet: Tailwind import, daisyUI themes, global rules
  config/               # non-visual modules: API base, fetch helpers, constants, types
    api.ts
  components/           # reusable, presentational UI used across pages
    Portfolio.tsx
    ThemeToggle.tsx
  pages/                # one component per route (mounted by App.tsx)
    TokenGate.tsx
    Admin.tsx
    Expired.tsx
  assets/               # imported images (Vite hashes them); group in subfolders
    athletics/
lambda/                 # AWS handlers — each its own folder + package.json
  validate/  redirect/  admin/
public/                 # served verbatim at site root (resume.pdf, favicon, robots.txt)
```

**Where things go**
- A new routed screen → `pages/`, and add its `<Route>` to `App.tsx`.
- A reusable widget → `components/`.
- Anything non-visual (network, constants, shared types) → `config/`.
- New images → `src/assets/<group>/` and `import` them (never hardcode into `public/`
  unless the file needs a fixed public URL, e.g. `resume.pdf`).
- `App.tsx` stays a pure route table. `index.css` is the only `.css` file — do not
  add per-component stylesheets (styling is utility classes; see §6).

## 4. Formatting & whitespace

| Rule | Value |
|------|-------|
| Indentation | 2 spaces, never tabs |
| Quotes | single `'…'` (JSX attributes use `"…"`) |
| Semicolons | **frontend (`src/`): none.** Lambda (`lambda/`): yes (Node convention) |
| Trailing commas | yes, in multi-line arrays/objects/params |
| Line length | aim ≤ 100 chars; wrap long JSX attributes one-per-line |
| Blank lines | one between logical blocks/functions; **never two or more** in a row |
| Trailing whitespace | none |
| End of file | exactly one trailing newline |

JSX: when an element has more than ~2 attributes or exceeds the line limit, put each
attribute on its own line with the closing `>` aligned to the opening tag, e.g.:

```tsx
<a
  href={link.href}
  className={linkClass(link.href)}
  aria-current={link.href === `#${active}` ? 'page' : undefined}
>
  {link.label}
</a>
```

## 5. TypeScript & React conventions

- **Components are named function declarations** with a default export at the bottom:
  `function Admin() { … }` … `export default Admin`. Do not use
  `const X = () => …` for components.
- **One default-exported component per file.** Small presentational sub-components
  used only by that file may live in the same file, declared *above* the main one
  (e.g. `AnalyticsItem` in `Admin.tsx`).
- **Props:** type with an `interface` named `<Component>Props`. Destructure in the
  signature: `function AnalyticsItem({ token, events }: AnalyticsItemProps)`.
- **Types:** `interface` for object/props shapes; `type` for unions/aliases
  (`type Theme = 'lofi' | 'business'`).
- **Helpers** (pure functions, e.g. `getInitialTheme`, `formatDate`) are declared
  above the component or, if shared, live in `config/`.
- **Module constants** are `UPPER_SNAKE_CASE` at top of file (`NAV_LINKS`,
  `API_BASE`, `SECTION_IDS`). Functions/variables are `camelCase`.
- **Custom hooks** start with `use` and live next to their first user (or in
  `config/` if shared). Effects must declare correct deps and return a cleanup
  function when they subscribe/observe (see `useActiveSection`).
- **Guard one-shot effects** (anything that fires a network call / logs an event)
  against React StrictMode double-invocation and re-renders with a `useRef`
  latch — never assume an effect runs exactly once.
- Prefer early returns over nested conditionals (login screen in `Admin.tsx`).

## 6. Styling (Tailwind v4 + daisyUI)

- **Utility-first.** Style with Tailwind classes inline. No component CSS files;
  global rules and the daisyUI theme config live only in `src/index.css`.
- **Use daisyUI semantic color tokens, never raw colors:** `bg-base-100/200/300`,
  `text-base-content` (with `/70`, `/60`, `/50` opacity for muted text),
  `text-primary`, `border-base-300`. This keeps both themes (`lofi`/`business`)
  working. Never hardcode hex or Tailwind palette colors (`bg-gray-100`).
- **Class order (loose but consistent):** layout/position → box model (display,
  flex/grid, gap) → sizing → spacing (m/p) → typography → color/border → effects →
  state/responsive variants. Responsive prefixes (`sm:`) and state (`hover:`) last.
- Prefer daisyUI components (`btn`, `card`, `alert`, `toast`, `collapse`, `badge`,
  `input`, `tabs`) over hand-rolled equivalents.
- No inline `style={{…}}` unless a value is genuinely dynamic and not expressible
  as a class.
- The sticky header offset relies on `scroll-mt-20` on sections and
  `scrollbar-gutter: stable` on `html` (prevents layout shift when content grows) —
  keep both.

## 7. Comments

- Explain **why**, not **what**. The code says what; a comment earns its place by
  adding intent, a gotcha, or context.
- Sentence-case, concise, placed on the line *above* the code (or inline for a
  short JSX note: `{/* sun — shown in light (lofi) mode */}`).
- A short block comment header is welcome on non-obvious modules (see the Lambda
  handlers and `useActiveSection`).
- No commented-out code. No redundant comments (`// set state`).

## 8. Data flow & separation of concerns

- **`App.tsx`**: routing only.
- **`pages/`**: own data fetching + page state for their screen.
- **`components/`**: presentational; receive data via props, stay stateless where
  possible (local UI state like "expanded" is fine — see `AnalyticsItem`).
- **`config/api.ts`**: the network layer — base URL, typed request helpers, and
  the response interfaces. New endpoints get a typed helper here rather than a raw
  `fetch` buried in a component.
- Keep secrets out of the frontend entirely. Admin auth is a bearer password held
  in `sessionStorage` and sent per-request; never hardcode it.

## 9. Lambda handlers (`lambda/`)

- `validate` and `redirect` are plain ESM (`.mjs`); `admin` is TypeScript compiled
  via `tsc` (`npm run build` in `lambda/admin`). All target Node 20 and rely on the
  runtime-provided AWS SDK v3 — do not bundle `@aws-sdk`.
- Each handler opens with a block comment describing its route and behavior.
- Read config from `process.env` with a safe default:
  `const TOKENS_TABLE = process.env.TOKENS_TABLE || 'Tokens'`. **Never commit real
  secret values** — the defaults are placeholders; real values live in the Lambda
  env in AWS.
- Define a single `CORS_HEADERS`/`headers` constant and reuse it.
- Semicolons are used here (Node style); 2-space indent and single quotes still apply.

## 10. Git & deploy workflow

- Branch off `main`, push, open a PR (**base `main` ← compare your branch**), let CI
  go green, then merge. Merge to `main` auto-deploys via GitHub Actions + OIDC.
- Commit messages: short imperative subject, lower-case, no trailing period
  (`fix analytics double-count`).
- `package-lock.json` is committed (root + `lambda/admin`); CI uses `npm ci`.

## 11. Quick do / don't

- ✅ Run `npm run build` before committing.   ❌ Commit on a red typecheck.
- ✅ daisyUI tokens (`base-content`).          ❌ Raw colors (`text-gray-500`).
- ✅ `function Foo()` components.              ❌ `const Foo = () => …` components.
- ✅ Network logic in `config/api.ts`.         ❌ Secrets or hardcoded creds anywhere.
- ✅ Guard one-shot effects with a ref.        ❌ Assume an effect runs once.
- ✅ One trailing newline, no double blanks.   ❌ Per-component `.css` files.
