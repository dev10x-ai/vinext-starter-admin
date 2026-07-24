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
| Server state | **TanStack Query** | `src/queries/` |
| Client / session UI | **Zustand** (+ persist) | `src/store/` |
| Forms | React Hook Form + Zod | screens under `src/views/` |
| Routing | React Router | `src/App.tsx`, layouts in `src/layouts/` |
| Mock API | json-server + custom auth | `mock/` |

**Rule of thumb:** fetch and mutate with Query; keep auth session, theme, tenant, and table prefs in Zustand.

## Zustand stores

| Store | Role |
|-------|------|
| `useAuthStore` | Session user + token |
| `useUiStore` | Theme, night mode, notifications drawer, `tablePrefs` (page size) |
| Tenant selection | Header switcher (persisted with UI prefs) |

Table page size for [DataTable](./components/data-table) survives reloads via `useUiStore.tablePrefs`.

## TanStack Query

Hooks under `src/queries/` wrap the mock REST API (`VITE_API_URL`, default `http://localhost:4001`). List pages (Users, Tenants) load rows with Query and pass them into DataTable; mutations invalidate the matching query keys.

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

## Next steps

1. [Components overview](./components/overview) — design-system map and reading order  
2. [Forms](./components/forms) → fields → patterns  
3. [Lists & tables](./components/lists-and-tables) → [DataTable](./components/data-table)  
4. [API Server](./api/server) when you need the mock contract
