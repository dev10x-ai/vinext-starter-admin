---
sidebar_position: 1
title: Getting started
slug: /
---

# Getting started

ACP Admin is a mocked multi-tenant operations console. The UI shell follows **Macro Wallets** patterns; branding defaults to the **Default** sober-blue theme (also **Ruby** and **Emerald** packs).

## Prerequisites

- Node.js 20+
- npm

## Install & run

From the repository root:

```bash
make setup
make dev        # admin UI :5173 + mock API :4001
make docs       # documentation :3000
```

Or separately:

```bash
npm install
npm run mock    # json-server
npm run dev     # Vite admin + landing
cd website && npm install && npm start
```

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

- `src/` — React admin + landing
- `mock/` — json-server database + auth routes
- `website/` — this Docusaurus site
- `docs/` (repo root) — engineering comparison & design notes

## Next steps

1. Open the [landing page](http://localhost:5173/)
2. Sign in to the console
3. Explore Users, Tenants, Roles, and Platform settings
4. Read the component docs:
   - [Components overview](./components/overview)
   - [Forms](./components/forms) · [Form fields](./components/form-fields) · [Form patterns](./components/form-patterns)
   - [DataTable](./components/data-table) (filters, columns, export)
5. Read [API Server](./api/server) and the interactive [API Reference](/api/reference/acp-admin-mock-api) (Try It → `http://localhost:4001`)
