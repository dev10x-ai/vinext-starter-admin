# App Router migration notes (vinext) — ACP Admin

## Scope

Migrate **acp-admin** (vinext-starter-admin) from Vite SPA + React Router 7 to
**vinext App Router**, following xip-admin conventions. This is not the
macro-wallets-front migration.

## Cutover model

ACP had no Next Pages Router — only React Router. There is no pages+app hybrid
phase. Routes cut over to `app/` file routes in one pass, preserving URLs.

## RSC boundary

- Thin server `page.tsx` / `layout.tsx` when possible.
- Interactive UI (custom DS, Zustand, TanStack Query, RHF) lives in `"use client"`
  modules under colocated `app/**/_components/*-view.tsx` (xip style).
- Shared UI / helpers live at repo root (`components/`, `layouts/`, `lib/`, …) — no top-level `src/`.
- Do not import heavy client UI into server pages beyond the client view entry.
- **Do not** put client views under a Pages Router `pages/` tree — vinext would treat that as Pages Router.

## Pattern

```
app/(group)/route/page.tsx                 # thin server entry
app/(group)/route/_components/*-view.tsx   # "use client" route UI
components/ layouts/ lib/ …                # shared modules (not route-owned)
```

## Route map (React Router → App Router)

| URL | App Router file |
|-----|-----------------|
| `/` | `(public)/page.tsx` |
| `/login` … `/change-password` | `(auth)/…/page.tsx` |
| `/app` | `app/page.tsx` |
| `/app/access/*` | `app/access/…/page.tsx` |
| `/app/design-system/*` | `app/design-system/…/page.tsx` |
| `/app/profile` | `app/profile/page.tsx` |
| `/app/settings/*` | `app/settings/…/page.tsx` |

## Preserved

- Zustand + TanStack Query + RHF + Zod
- Themes, Cmd+K, menu tree, DataTable, DS pages
- Local mock API via App Router `app/api/[[...path]]` (reuses `worker/api`)
- Optional json-server (`make mock`, set `VITE_API_URL=http://localhost:4001`)
- Docusaurus docs (`website/`) stay separate

## Deploy

| Mode | Command |
|------|---------|
| Local Node SSR | `vinext dev` / `vinext build` / `vinext start` |
| Cloudflare Workers | `vinext deploy` (native) or CI with Workers build |

`wrangler.admin.toml` keeps the legacy Worker + assets shape for `/api` mock
compatibility. Prefer App Router `/api` handlers under vinext.

**No** Next+OpenNext.
