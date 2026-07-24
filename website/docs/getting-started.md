---
sidebar_position: 1
title: Getting started
slug: /
---

# Getting started

ACP Admin is a mocked multi-tenant operations console on **vinext App Router**. The UI shell follows **Macro Wallets** patterns; branding defaults to the **Default** sober-blue theme (also **Ruby** and **Emerald** packs).

**Production:** [https://vinext-starter-admin.dev10x.ai](https://vinext-starter-admin.dev10x.ai) — one Cloudflare Worker serves the app, mock API (`/api`), Vite client assets (`/assets`), and these docs (`/docs`).

## Prerequisites

- Node.js 22+
- npm

## Install & run

From the repository root:

```bash
make setup
make dev        # vinext App Router :5173 (in-app /api mock)
make docs       # documentation :3000/docs/
```

Or separately:

```bash
npm install
npm run dev     # vinext admin + landing + /api
cd website && npm install && npm start
```

Optional standalone json-server mock (legacy DX): `make mock` on `:4001`. Prefer same-origin `/api` from `make dev`.

## Demo credentials

| Email | Password | Notes |
|-------|----------|-------|
| `admin@acp.local` | `Admin123!` | Owner, password login without 2FA |
| `sam@acp.local` | `Operator1!` | Operator, **2FA challenge** after password (`123456`) |

### Login with OTP (passwordless)

1. Open `/login` and choose **Login with OTP**
2. Enter any known user email (e.g. `admin@acp.local`)
3. Click **Send OTP code**, then enter demo code `123456` on `/otp`

Password login + 2FA still uses the same OTP screen when `twoFactorEnabled` is true.

## Project layout

- `app/` — vinext App Router (route groups, `/api` handlers)
- `src/views/` — client page views used by thin server pages
- `src/` — shared components, layouts, stores, queries
- `mock/` — optional json-server + OpenAPI seed
- `worker/` — shared mock API modules (App Router + Worker)
- `website/` — this Docusaurus site
- `docs/` (repo root) — CI/CD notes + README media

## Next steps

1. Open the [landing page](pathname:///)
2. Sign in to the console
3. Explore Users, Tenants, Roles, and Platform settings
4. Read docs in order:
   - [Concepts](./concepts) — Zustand, Query, themes, layouts
   - [Components overview](./components/overview)
   - Forms → [Lists & tables](./components/lists-and-tables) → [DataTable](./components/data-table)
   - [Menu tree](./components/menu-tree) · [Layout & chrome](./components/layout)
5. Read [API Server](./api/server) and the interactive [API Reference](./api/reference/acp-admin-mock-api) (Try It → same-origin `/api`, or local mock on `:4001`)

Use the **language switcher** (navbar) for Português. Getting started and the API section are translated; component docs are English for now.
