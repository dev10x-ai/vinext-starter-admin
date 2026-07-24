---
sidebar_position: 1
title: Primeiros passos
slug: /
---

# Primeiros passos

O ACP Admin é um console de operações multi-tenant com API mockada. O shell da UI segue padrões do **Macro Wallets**; o branding padrão é o tema **Default** (azul sóbrio), com packs **Ruby** e **Emerald**.

## Pré-requisitos

- Node.js 20+
- npm

## Instalar e rodar

Na raiz do repositório:

```bash
make setup
make dev        # admin UI :5173 + mock API :4001
make docs       # documentação :3000
```

Ou separadamente:

```bash
npm install
npm run mock    # json-server
npm run dev     # Vite admin + landing
cd website && npm install && npm start
```

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

- `src/` — React admin + landing
- `mock/` — banco json-server + rotas de auth
- `website/` — este site Docusaurus
- `docs/` (raiz do repo) — notas de design e comparação

## Idiomas

Use o **seletor de idioma** na barra superior (**English** / **Português**).

- **Traduzido:** primeiros passos + seção API (servidor, exemplos REST, intro/tags da referência)
- **Em inglês por enquanto:** Concepts e Components (o seletor ainda funciona; páginas sem tradução usam o inglês)

## Próximos passos

1. Abra a [landing page](http://localhost:5173/)
2. Entre no console
3. Explore Users, Tenants, Roles e Platform settings
4. Leia a documentação na ordem:
   - [Concepts](./concepts) (EN) — Zustand, Query, temas, layouts
   - [Components overview](./components/overview) (EN)
   - Forms → [Lists & tables](./components/lists-and-tables) → [DataTable](./components/data-table)
   - [Menu tree](./components/menu-tree) · [Layout & chrome](./components/layout)
5. Leia [Servidor da API](./api/server) e a [Referência da API](./api/reference/acp-admin-mock-api) (Try It → `http://localhost:4001`)
