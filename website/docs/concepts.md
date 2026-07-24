---
sidebar_position: 2
title: Concepts
---

# Concepts

How ACP Admin is wired: state, data fetching, themes, and route shells.

## Stack at a glance

| Concern | Choice | Where |
|---------|--------|--------|
| UI | React + Vite + Tailwind | `src/` |
| Framework | **vinext App Router** | `app/` |
| Server state | **TanStack Query** | `src/queries/` |
| Client / session UI | **Zustand** (+ persist) | `src/store/` |
| Forms | React Hook Form + Zod | screens under `src/views/` |
| Routing | App Router | `app/` + thin pages importing `src/views/` |
| Mock API | App Router `/api/*` (shared `worker/` modules); optional json-server | `app/api/`, `worker/`, `mock/` |

**Rule of thumb:** fetch and mutate with Query; keep auth session, theme, tenant, and table prefs in Zustand.

## Zustand stores

| Store | Role |
|-------|------|
| `useAuthStore` | Session user + token |
| `useUiStore` | Theme, night mode, notifications drawer, `tablePrefs` (page size) |
| Tenant selection | Header switcher (persisted with UI prefs) |

Table page size for [DataTable](./components/data-table) survives reloads via `useUiStore.tablePrefs`.

## TanStack Query

Hooks under `src/queries/` wrap the mock REST API. With `make dev` (and on the Worker), the client calls **same-origin `/api`**. Optional standalone mock: `make mock` on `:4001`. List pages (Users, Tenants) load rows with Query and pass them into DataTable; mutations invalidate the matching query keys.

## Themes

Packs in `src/config/themes`:

- **Default** — sober blues (product default)
- **Ruby** — red + black
- **Emerald** — green, Macro-like

Each pack has light + night modes via CSS variables (`--color-*`). Switch from the user menu in the app header.

## Routing & layouts

| Layout | Routes | Chrome |
|--------|--------|--------|
| `PublicLayout` | Landing, marketing | Public nav |
| `AuthLayout` | Login, Signup, OTP, forgot password | **No** app header |
| `AppLayout` | `/app/*` console | Sidebar + sticky header |

Auth screens stay chrome-free so login/OTP feel like Macro-style auth, not an empty admin shell.

Route files live under `app/`; interactive UI stays in `src/views/` and shared layout components under `src/layouts/` / `src/components/`.

## Deploy surfaces (one Worker)

| Path | Role |
|------|------|
| `/` | Admin app (SSR + client) |
| `/api/*` | Mock API |
| `/assets/*` | Vite hashed JS/CSS (served from Worker ASSETS before SSR) |
| `/docs/*` | Docusaurus (merged into `dist/client/docs`) |

See `docs/ci-cd.md` in the repository for tags, preview URLs, and the `/assets` Worker routing note.

## Next steps

1. [Components overview](./components/overview) — design-system map and reading order  
2. [Forms](./components/forms) → fields → patterns  
3. [Lists & tables](./components/lists-and-tables) → [DataTable](./components/data-table)  
4. [API Server](./api/server) when you need the mock contract
