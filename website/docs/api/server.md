---
sidebar_position: 1
title: API Server
---

# API Server

The mock API is a **json-server** instance with custom auth routes.

- Entry: `mock/server.mjs`
- Data: `mock/db.json`
- OpenAPI: `mock/openapi.yaml` (source of truth for [API Reference](./reference/acp-admin-mock-api))
- Default port: `4001`
- Start: `make mock` or `npm run mock`

## Collections

| Resource | Path | Notes |
|----------|------|-------|
| Users | `/users` | CRUD |
| Tenants | `/tenants` | CRUD |
| Roles | `/roles` | CRUD |
| Permissions | `/permissions` | Read |
| Menu | `/menu` | Hierarchical items (`parentId` + `order`) |
| Menu reorder | `POST /menu/reorder` | Bulk `{ items: [{ id, parentId, order }] }` |
| Notifications | `/notifications` | Patch `read` |
| Settings | `/settings/:id` | `ai`, `email`, `thirdparty`, `logs` |
| Dashboard stats | `/dashboardStats` | Widgets |
| Hybrid search | `GET /search?q=` | Users, tenants, settings → `{ results: [{ type, id, title, subtitle?, url }] }` |

## Auth routes (custom)

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/auth/login` | `{ email, password }` | `{ requiresOtp, user, token }` |
| POST | `/auth/otp/request` | `{ email }` | starts passwordless OTP login; returns `demoOtp` in mock |
| POST | `/auth/otp` | `{ email, code }` | `{ user, token }` — verifies OTP for login **or** 2FA challenge; demo code `123456` |
| POST | `/auth/signup` | `{ name, organizationName, email, password }` | creates tenant + owner |
| POST | `/auth/forgot-password` | `{ email }` | message + demo OTP |
| POST | `/auth/change-password` | `{ email, currentPassword, newPassword }` | success message |

On the Worker / `make dev`, `/api/*` is same-origin and always served by the in-worker local mock. For a standalone local json-server instead, run `make mock` on `:4001` and set `VITE_API_URL=http://localhost:4001`.

## Tryable docs

1. Open the admin app (`make dev`) or production Worker so `/api` is available
2. Open **[API Reference](./reference/acp-admin-mock-api)** — use **Send API Request** / Try It against same-origin `/api` (or `http://localhost:4001` with `make mock`)
3. Or copy curl from [REST examples](./rest-examples)

### Regenerate after changing the OpenAPI file

```bash
make docs-gen-api   # regenerates website/docs/api/reference from mock/openapi.yaml
```

To swap in a real backend Swagger later: replace `mock/openapi.yaml` (or point `specPath` in `website/docusaurus.config.ts`) and run `make docs-gen-api` again.

## Languages

Docs ship in **English** (default) and **Português** (`/pt/...`). Use the navbar locale switcher. Hand-written API pages are fully translated; OpenAPI operation pages (Try It) keep English summaries from `mock/openapi.yaml`.

## Next steps

1. [REST examples](./rest-examples) — curl / HTTP snippets against `:4001`  
2. [API Reference](./reference/acp-admin-mock-api) — interactive OpenAPI (Try It)
