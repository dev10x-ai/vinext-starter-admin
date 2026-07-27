<p align="center">
  <img src="public/branding/acp-shield.svg" alt="ACP Admin" width="72" />
</p>

<h1 align="center">vinext-starter-admin</h1>

<p align="center">
  <strong>Fork-ready vinext App Router admin starter</strong> for multi-tenant operations consoles.<br />
  Demo brand: <strong>ACP Admin</strong> — Macro-inspired shell, Xip-filled gaps, landing + docs included.
</p>

<p align="center">
  <a href="https://vinext-starter-admin.dev10x.ai"><strong>Demo</strong></a> ·
  <a href="https://vinext-starter-admin.dev10x.ai/docs"><strong>Docs</strong></a> ·
  <a href="docs/ci-cd.md">CI/CD</a>
</p>

<p align="center">
  <a href="https://github.com/dev10x-ai/vinext-starter-admin/stargazers"><img src="https://img.shields.io/github/stars/dev10x-ai/vinext-starter-admin?style=flat-square&color=1B4F8A" alt="Stars" /></a>
  <a href="https://github.com/dev10x-ai/vinext-starter-admin/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/dev10x-ai/vinext-starter-admin/ci.yml?branch=main&style=flat-square&label=CI" alt="CI" /></a>
  <a href="https://github.com/dev10x-ai/vinext-starter-admin/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/dev10x-ai/vinext-starter-admin/deploy.yml?branch=main&style=flat-square&label=Deploy" alt="Deploy" /></a>
  <img src="https://img.shields.io/badge/coverage-69%25-yellowgreen?style=flat-square" alt="Line coverage ~69%" />
  <img src="https://img.shields.io/badge/node-%E2%89%A522-brightgreen?style=flat-square" alt="Node >= 22" />
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square" alt="Cloudflare Workers" />
</p>

---

## Tour

Desktop walkthrough (GIF). MP4 sources live under [`docs/media/`](docs/media/).

![ACP Admin desktop tour](docs/media/admin-tour-desktop.gif)

| Desktop | Mobile |
|---------|--------|
| [admin-tour-desktop.mp4](docs/media/admin-tour-desktop.mp4) | [admin-tour-mobile.mp4](docs/media/admin-tour-mobile.mp4) |

---

## Why this starter

Clone once, rename the brand, ship an admin product. You get:

- Authenticated **app shell** (sidebar, header, tenant switcher, command palette)
- **Mock API** with auth, OTP, RBAC-shaped resources, and hybrid search
- **Design-system pages** + reusable form / table primitives
- **Theme packs** (Default / Ruby / Emerald) with light & dark
- **Docusaurus docs** (EN + PT) with OpenAPI reference
- **CI + Cloudflare Workers** publish (tag → production, branch → preview)

Fork example: `slot-battle-acp` or any multi-tenant ops console.

---

## Quick start

```bash
make setup          # app + docs deps + Playwright Chromium
make dev            # vinext App Router :5173 (in-app /api mock)
make docs           # Docusaurus :3000/docs/ (local DX; production is /docs on the admin Worker)
```

| Demo user | Password | Notes |
|-----------|----------|--------|
| `admin@acp.local` | `Admin123!` | Full access |
| `sam@acp.local` | `Operator1!` | OTP `123456` |

```bash
make test           # Vitest unit tests
make test-e2e       # Playwright
make build          # Admin production build
make docs-build     # Docs → dist/client/docs (run after make build for deploy)
```

---

## Live links

| | URL |
|--|-----|
| **Admin (production)** | https://vinext-starter-admin.dev10x.ai |
| **Docs (production)** | https://vinext-starter-admin.dev10x.ai/docs |
| **Actions** | https://github.com/dev10x-ai/vinext-starter-admin/actions |

Docs ship on the **same Worker** at `/docs` (no separate docs hostname). Production updates on **`v*` git tags**. Branch pushes publish **Workers preview URLs** only (see [`docs/ci-cd.md`](docs/ci-cd.md)).

---

## Features

- Multi-tenant shell with tenant switcher and role-aware menu tree
- Global search + keyboard command palette
- Users / roles / tenants / menu CRUD patterns (modal routes)
- Notifications drawer, profile, settings panels
- Data table with filtering patterns; form kit (RHF + Zod)
- OTP login path and auth layouts
- Public landing page
- i18n-ready docs site (English + Português)

## Themes

Switch from the user menu — tokens apply instantly (persisted).

| Pack | Feel |
|------|------|
| **Default** | Navy / steel operations blue |
| **Ruby** | High-contrast red & black |
| **Emerald** | Green growth accent |

Each pack ships light and dark modes.

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19, Vite 8, Tailwind CSS 4 |
| Framework | vinext App Router (RSC-capable, Cloudflare-native) |
| State | Zustand |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Routing | App Router (`app/`) |
| Charts | Recharts |
| Unit tests | Vitest + Testing Library |
| E2E | Playwright |
| Docs | Docusaurus 3 (+ OpenAPI plugin) |
| Mock API | App Router `/api/*` (reuses `worker/`); optional upstream via `API_PROXY_TARGET`; optional json-server |
| Hosting | Cloudflare Workers (`wrangler.admin.toml` / `vinext deploy`) — docs at `/docs` |

---

## Test coverage

Latest local Vitest run (v8):

| Metric | Coverage |
|--------|----------|
| Statements | **67.7%** |
| Branches | **69.8%** |
| Functions | **57.5%** |
| Lines | **69.1%** |

```bash
npm test -- --coverage
```

---

## Project layout

```
app/            vinext App Router (route groups, colocated _components/*-view.tsx)
components/     Shared UI (table, forms, layout chrome, brand)
layouts/        Auth / public / app shell layouts
lib/ hooks/ store/ queries/ config/ types/ styles/
mock/           Optional json-server + OpenAPI seed
worker/         Shared mock API modules (App Router + Worker)
website/        Docusaurus documentation
docs/           Engineering notes + media for README
e2e/            Playwright specs
.github/        CI, preview, and production deploy workflows
```

---

## Deploy model

| Event | Result |
|-------|--------|
| Push to a **branch** | Preview version of the single admin Worker (`wrangler versions upload`) — includes `/docs` |
| Push tag **`v*`** | Production deploy to `vinext-starter-admin.dev10x.ai` (app + `/api` + `/docs` + `/assets`) |
| PR / branch push | CI: typecheck, lint, unit tests, builds |

Build order for deploy: `make build && make docs-build` (merges `website/build` → `dist/client/docs`).

Secrets (never commit): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

Details: [`docs/ci-cd.md`](docs/ci-cd.md).

---

## Collaborators

Thanks to everyone contributing to this starter.

<p align="center">
  <a href="https://github.com/dev10x-ai/vinext-starter-admin/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=dev10x-ai/vinext-starter-admin" alt="Contributors" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/raphaelcangucu"><img src="https://img.shields.io/badge/maintainer-raphaelcangucu-1B4F8A?style=flat-square&logo=github" alt="Maintainer" /></a>
</p>

---

## Makefile cheatsheet

| Target | Description |
|--------|-------------|
| `make setup` | Install everything |
| `make dev` | vinext App Router + in-app `/api` |
| `make docs` | Docs dev server (`:3000/docs/`) |
| `make docs-gen-api` | Regenerate API Reference MDX |
| `make docs-build` | Build docs (en + pt) → `dist/client/docs` |
| `make test` / `make test-e2e` | Unit / Playwright |
| `make build` | Admin production build (`dist/client` + `dist/server`) |

---

<p align="center">
  <sub>Built as a reusable kit — fork it, rebrand it, ship it.</sub>
</p>
