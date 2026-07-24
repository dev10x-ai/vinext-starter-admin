---
sidebar_position: 2
title: REST examples
---

# REST examples

Practical examples against the mock API. Curl below uses `http://localhost:4001` for the standalone mock (`make mock`). On the Worker / `make dev`, replace the host with same-origin `/api` (e.g. `https://vinext-starter-admin.dev10x.ai/api/...` or `http://127.0.0.1:5173/api/...`).

For the full interactive reference with **Try It**, see [API Reference](./reference/acp-admin-mock-api) (generated from `mock/openapi.yaml`).

## Demo credentials

| Email | Password | Notes |
|-------|----------|-------|
| `admin@acp.local` | `Admin123!` | Owner, no 2FA |
| `sam@acp.local` | `Operator1!` | Operator, 2FA → OTP `123456` |
| Demo OTP | `123456` | Passwordless login / 2FA |

## Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@acp.local",
  "password": "Admin123!"
}
```

```bash
curl -s http://localhost:4001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@acp.local","password":"Admin123!"}' | jq
```

Response (no 2FA):

```json
{
  "requiresOtp": false,
  "user": { "id": "1", "name": "Alex Admin", "email": "admin@acp.local", "role": "owner" },
  "token": "mock-token-1"
}
```

## Login with OTP (passwordless)

```http
POST /auth/otp/request
Content-Type: application/json

{
  "email": "admin@acp.local"
}
```

```bash
curl -s http://localhost:4001/auth/otp/request \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@acp.local"}' | jq
```

Then verify the code:

```bash
curl -s http://localhost:4001/auth/otp \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@acp.local","code":"123456"}' | jq
```

## List users

```http
GET /users
```

```bash
curl -s http://localhost:4001/users | jq
```

## Create tenant

```http
POST /tenants
Content-Type: application/json

{
  "name": "New Org",
  "slug": "new-org",
  "plan": "growth",
  "status": "active",
  "usersCount": 0,
  "createdAt": "2026-07-23T12:00:00Z"
}
```

```bash
curl -s http://localhost:4001/tenants \
  -H 'Content-Type: application/json' \
  -d '{"name":"New Org","slug":"new-org","plan":"growth","status":"active","usersCount":0,"createdAt":"2026-07-23T12:00:00Z"}' | jq
```

## Mark notification as read

```http
PATCH /notifications/1
Content-Type: application/json

{ "read": true }
```

```bash
curl -s -X PATCH http://localhost:4001/notifications/1 \
  -H 'Content-Type: application/json' \
  -d '{"read":true}' | jq
```

## Update AI settings

```http
PUT /settings/ai
Content-Type: application/json

{
  "id": "ai",
  "category": "ai",
  "provider": "anthropic",
  "apiKey": "sk-mock-****",
  "model": "claude-sonnet",
  "enabled": true
}
```

```bash
curl -s -X PUT http://localhost:4001/settings/ai \
  -H 'Content-Type: application/json' \
  -d '{"id":"ai","category":"ai","provider":"anthropic","apiKey":"sk-mock-****","model":"claude-sonnet","enabled":true}' | jq
```

## Reorder menu (tree)

```http
POST /menu/reorder
Content-Type: application/json

{
  "items": [
    { "id": "5", "parentId": "2", "order": 3 },
    { "id": "6", "parentId": "2", "order": 4 }
  ]
}
```

```bash
curl -s -X POST http://localhost:4001/menu/reorder \
  -H 'Content-Type: application/json' \
  -d '{"items":[{"id":"5","parentId":"2","order":3},{"id":"6","parentId":"2","order":4}]}' | jq
```

## Hybrid search (command palette)

```http
GET /search?q=alex
```

```bash
curl -s 'http://localhost:4001/search?q=alex' | jq
curl -s 'http://localhost:4001/search?q=ai' | jq
curl -s 'http://localhost:4001/search' | jq   # suggestions (empty q)
```

Response:

```json
{
  "query": "alex",
  "results": [
    {
      "type": "user",
      "id": "1",
      "title": "Alex Admin",
      "subtitle": "admin@acp.local",
      "url": "/app/access/users/1/edit"
    }
  ]
}
```

Types: `user` → `/app/access/users/:id/edit`, `tenant` → `/app/access/tenants/:id/edit`, `setting` → `/app/settings/{ai|email|third-party|logs}`.

## Dashboard

```bash
curl -s http://localhost:4001/dashboardStats | jq
```

## Errors

| Status | When |
|--------|------|
| 400 | Invalid payload / wrong OTP |
| 401 | Invalid credentials |
| 404 | Resource not found |
| 409 | Email already registered on signup |

## Next steps

1. [API Reference](./reference/acp-admin-mock-api) — Try It in the browser against `http://localhost:4001`
2. Back to [API Server](./server) for collections and auth routes
3. In the UI: [Lists & tables](../components/lists-and-tables) / [DataTable](../components/data-table) consume these endpoints
