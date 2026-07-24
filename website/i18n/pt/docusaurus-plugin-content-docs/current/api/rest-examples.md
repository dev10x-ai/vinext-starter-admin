---
sidebar_position: 2
title: Exemplos REST
---

# Exemplos REST

Exemplos práticos contra o mock local (`http://localhost:4001`).

Pré-requisito: `make mock` ou `make dev` (mock na porta **4001**).

Para a referência completa com **Try It**, veja [Referência da API](./reference/acp-admin-mock-api) (gerada a partir de `mock/openapi.yaml`).

## Credenciais demo

| Email | Password | Notas |
|-------|----------|-------|
| `admin@acp.local` | `Admin123!` | Owner, sem 2FA |
| `sam@acp.local` | `Operator1!` | Operator, 2FA → OTP `123456` |
| OTP demo | `123456` | Login sem senha / 2FA |

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

Resposta (sem 2FA):

```json
{
  "requiresOtp": false,
  "user": { "id": "1", "name": "Alex Admin", "email": "admin@acp.local", "role": "owner" },
  "token": "mock-token-1"
}
```

## Login com OTP (sem senha)

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

Depois verifique o código:

```bash
curl -s http://localhost:4001/auth/otp \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@acp.local","code":"123456"}' | jq
```

## Listar usuários

```http
GET /users
```

```bash
curl -s http://localhost:4001/users | jq
```

## Criar tenant

```http
POST /tenants
Content-Type: application/json

{
  "name": "Nova Org",
  "slug": "nova-org",
  "plan": "growth",
  "status": "active",
  "usersCount": 0,
  "createdAt": "2026-07-23T12:00:00Z"
}
```

```bash
curl -s http://localhost:4001/tenants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Nova Org","slug":"nova-org","plan":"growth","status":"active","usersCount":0,"createdAt":"2026-07-23T12:00:00Z"}' | jq
```

## Marcar notificação como lida

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

## Atualizar settings de AI

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

## Reordenar menu (árvore)

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

## Busca híbrida (command palette)

```http
GET /search?q=alex
```

```bash
curl -s 'http://localhost:4001/search?q=alex' | jq
curl -s 'http://localhost:4001/search?q=ai' | jq
curl -s 'http://localhost:4001/search' | jq   # sugestões (q vazio)
```

Resposta:

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

Tipos: `user` → `/app/access/users/:id/edit`, `tenant` → `/app/access/tenants/:id/edit`, `setting` → `/app/settings/{ai|email|third-party|logs}`.

## Dashboard

```bash
curl -s http://localhost:4001/dashboardStats | jq
```

## Erros

| Status | Quando |
|--------|--------|
| 400 | Payload inválido / OTP incorreto |
| 401 | Credenciais inválidas |
| 404 | Recurso inexistente |
| 409 | E-mail já cadastrado no signup |

## Próximos passos

1. [Referência da API](./reference/acp-admin-mock-api) — Try It no browser contra `http://localhost:4001`
2. Voltar ao [Servidor da API](./server) para coleções e rotas de auth
3. No UI: [Lists & tables](../components/lists-and-tables) / [DataTable](../components/data-table) consomem esses endpoints
