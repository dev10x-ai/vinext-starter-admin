---
sidebar_position: 1
title: Primeiros passos
slug: /
---

# Primeiros passos

O ACP Admin é um console de operações multi-tenant com API mockada em **vinext App Router**. O shell da UI segue padrões do **Macro Wallets**; o branding padrão é o tema **Default** (azul sóbrio), com packs **Ruby** e **Emerald**.

**Produção:** [https://vinext-starter-admin.dev10x.ai](https://vinext-starter-admin.dev10x.ai) — um único Worker Cloudflare serve o app, a API mock (`/api`), os assets Vite (`/assets`) e esta documentação (`/docs`).

## Pré-requisitos

- Node.js 22+
- npm

## Instalar e rodar

Na raiz do repositório:

```bash
make setup
make dev        # vinext App Router :5173 (/api no mesmo app)
make docs       # documentação :3000/docs/
```

Ou separadamente:

```bash
npm install
npm run dev     # vinext admin + landing + /api
cd website && npm install && npm start
```

Mock json-server opcional (DX legado): `make mock` em `:4001`. Prefira `/api` na mesma origem com `make dev`.

## Credenciais demo

| Email | Password | Notas |
|-------|----------|-------|
| `admin@acp.local` | `Admin123!` | Owner, login por senha sem 2FA |
| `sam@acp.local` | `Operator1!` | Operator, **desafio 2FA** após a senha (`123456`) |

### Login com OTP (sem senha)

1. Abra `/login` e escolha **Login with OTP**
2. Informe um e-mail de usuário conhecido (ex.: `admin@acp.local`)
3. Clique em **Send OTP code** e digite o código demo `123456` em `/otp`

Login com senha + 2FA também usa a mesma tela de OTP quando `twoFactorEnabled` é true.

## Layout do projeto

- `app/` — vinext App Router (grupos de rotas, handlers `/api`)
- `src/views/` — views client usadas por páginas server finas
- `src/` — componentes, layouts, stores e queries compartilhados
- `mock/` — json-server opcional + seed OpenAPI
- `worker/` — módulos da API mock (App Router + Worker)
- `website/` — este site Docusaurus
- `docs/` (raiz do repo) — notas de CI/CD + mídia do README

## Idiomas

Use o **seletor de idioma** na barra superior (**English** / **Português**).

- **Traduzido:** primeiros passos + seção API (servidor, exemplos REST, intro/tags da referência)
- **Em inglês por enquanto:** Concepts e Components (o seletor ainda funciona; páginas sem tradução usam o inglês)

## Próximos passos

1. Abra a [landing page](pathname:///)
2. Entre no console
3. Explore Users, Tenants, Roles e Platform settings
4. Leia a documentação na ordem:
   - [Concepts](./concepts) (EN) — Zustand, Query, temas, layouts
   - [Components overview](./components/overview) (EN)
   - Forms → [Lists & tables](./components/lists-and-tables) → [DataTable](./components/data-table)
   - [Menu tree](./components/menu-tree) · [Layout & chrome](./components/layout)
5. Leia [Servidor da API](./api/server) e a [Referência da API](./api/reference/acp-admin-mock-api) (Try It → mesma origem `/api`, ou mock local em `:4001`)
