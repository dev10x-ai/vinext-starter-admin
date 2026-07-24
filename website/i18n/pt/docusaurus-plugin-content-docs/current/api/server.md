---
sidebar_position: 1
title: Servidor da API
---

# Servidor da API

A API mock é uma instância **json-server** com rotas customizadas de autenticação.

- Entrada: `mock/server.mjs`
- Dados: `mock/db.json`
- OpenAPI: `mock/openapi.yaml` (fonte da [Referência da API](./reference/acp-admin-mock-api))
- Porta padrão: `4001`
- Subir: `make mock` ou `npm run mock`

## Coleções

| Recurso | Path | Notas |
|---------|------|-------|
| Users | `/users` | CRUD |
| Tenants | `/tenants` | CRUD |
| Roles | `/roles` | CRUD |
| Permissions | `/permissions` | Leitura |
| Menu | `/menu` | Itens hierárquicos (`parentId` + `order`) |
| Reordenar menu | `POST /menu/reorder` | Bulk `{ items: [{ id, parentId, order }] }` |
| Notifications | `/notifications` | Patch em `read` |
| Settings | `/settings/:id` | `ai`, `email`, `thirdparty`, `logs` |
| Dashboard stats | `/dashboardStats` | Widgets |
| Busca híbrida | `GET /search?q=` | Users, tenants, settings → `{ results: [{ type, id, title, subtitle?, url }] }` |

## Rotas de auth (custom)

| Método | Path | Body | Resposta |
|--------|------|------|----------|
| POST | `/auth/login` | `{ email, password }` | `{ requiresOtp, user, token }` |
| POST | `/auth/otp/request` | `{ email }` | inicia login OTP sem senha; retorna `demoOtp` no mock |
| POST | `/auth/otp` | `{ email, code }` | `{ user, token }` — verifica OTP de login **ou** 2FA; código demo `123456` |
| POST | `/auth/signup` | `{ name, organizationName, email, password }` | cria tenant + owner |
| POST | `/auth/forgot-password` | `{ email }` | mensagem + OTP demo |
| POST | `/auth/change-password` | `{ email, currentPassword, newPassword }` | mensagem de sucesso |

Configure o client admin com `VITE_API_URL` (padrão `http://localhost:4001`).

## Docs com Try It

1. Suba o mock: `make mock` (ou `make dev`)
2. Abra a **[Referência da API](./reference/acp-admin-mock-api)** — use **Send API Request** / Try It contra `http://localhost:4001`
3. Ou copie curl dos [Exemplos REST](./rest-examples)

### Regenerar após alterar o OpenAPI

```bash
make docs-gen-api   # regenera website/docs/api/reference a partir de mock/openapi.yaml
```

Para trocar por um Swagger de backend real depois: substitua `mock/openapi.yaml` (ou o `specPath` em `website/docusaurus.config.ts`) e rode `make docs-gen-api` de novo.

:::info Idioma da referência OpenAPI
A introdução e as páginas de tags desta referência estão traduzidas. As páginas de operação (Try It) usam o texto gerado a partir de `mock/openapi.yaml` em **inglês**. Os [Exemplos REST](./rest-examples) e este guia estão em português.
:::

## Próximos passos

1. [Exemplos REST](./rest-examples) — snippets curl / HTTP contra `:4001`
2. [Referência da API](./reference/acp-admin-mock-api) — OpenAPI interativo (Try It)
