# ACP Admin — Design Spec (v1 mocked)

Date: 2026-07-23  
Status: Approved via parent brief (autonomous build)

## Goal

Mocked admin frontend for ACP that copies Macro Wallets shell/UX patterns, fills Xip gaps (especially Signup), and is runnable locally via Makefile + json-server.

## Stack

- Vite + React 19 + TypeScript
- React Router
- Tailwind CSS v4 (CSS variable themes)
- Zustand (auth, theme, notifications, tenant)
- React Hook Form + Zod
- Recharts (dashboard)
- json-server mock API
- Vitest + Playwright
- Makefile orchestration

## Layouts

1. **AuthLayout** — centered card, brand logo only. **No app header** (no search/tenant/user/notifications).
2. **AppLayout** — sidebar + sticky header (search, tenant select, notifications, user menu).

## Screens (v1)

Public: Brand-first landing (`/`) with public nav (docs / sign-in / signup)  
Auth: Login, Signup, Forgot Password, Change Password, OTP  
App: Dashboard, Users CRUD, Permissions/Roles/Menu tree, Tenants CRUD, Profile (+ 2FA), Platform Settings (AI, email, third-party APIs, logs)

## Documentation

Docusaurus package at `website/` (ACP sober-blue branding): Getting started, Components, API Server, REST API examples. Makefile: `make docs`, `make docs-build`, `make docs-serve`.

## Themes

**Default** (sober blues), **Ruby** (red + black), and **Emerald** (green). Each supports light + night (dark) mode.

## Data

All CRUD via json-server `mock/db.json`. Auth is mocked client-side against users collection; demo OTP `123456`.

## Out of scope / deferred

- Real backend / JWT cookies
- Full i18n parity (EN strings only in v1)
- Wallet/transaction product domains from Macro
- Complete Playwright coverage of every CRUD edge case (harness + critical paths in v1)
