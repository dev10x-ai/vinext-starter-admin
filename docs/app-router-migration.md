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
  modules under colocated `_components/` or existing `src/views` / `src/layouts`
  / `src/components`.
- Do not import heavy client UI into server pages beyond the client view entry.
- **Do not** put client views under `src/pages/` — vinext treats that as Pages Router.

## Pattern

```
app/(group)/route/page.tsx              # server: metadata + <View />
app/(group)/route/_components/*.tsx     # "use client" UI (optional)
src/views/...                           # client page views (reused; not routable)
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
- Mock API via App Router `app/api/[[...path]]` (reuses `worker/api`)
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
