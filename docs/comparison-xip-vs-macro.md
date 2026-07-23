# Gap analysis: Macro Wallets vs Xip Cash Admin

**Reference of truth for ACP Admin UX/architecture copy:** [Macro Wallets Front](https://github.com/clouapp/macro-wallets-front)  
**Cross-check:** [Xip Cash Admin](https://github.com/xipcash/admin)  
**ACP patterns:** [slotbattle-acp](https://github.com/GambaLabs/slotbattle-acp) — *clone returned an empty repository on 2026-07-23; local `~/Projects/gamba/slotbattle` Makefile/ops patterns used instead.*

Cloned under `references/` (gitignored) for side-by-side inspection.

---

## Stack snapshot

| Area | Macro Wallets | Xip Admin |
|------|---------------|-----------|
| Runtime | vinext + Vite + React 19 (pages) | vinext + Vite + React 19 (App Router) |
| UI | HeroUI v3 + Tailwind 4 + lucide | HeroUI v2 + Tailwind 4 + heroicons |
| State | Redux Toolkit + redux-persist + SWR | Zustand + TanStack Query |
| Forms | Local state + validation helpers | React Hook Form + Zod |
| i18n | i18next (en/pt) | i18next (en/pt-BR) |
| Themes | JSON theme packs + whitelabel | Single brand tokens (Macro values adopted) |
| Tests | Vitest + Playwright | Vitest + Playwright |
| Auth model | Password login + 2FA + **Signup/register** | Email OTP login; **no signup** |

---

## What Macro has that Xip lacks

1. **Signup / Register** (`/login/register`) — organization name, full name, email, password strength meter; Xip has no self-serve admin signup.
2. **Multi-theme / whitelabel packs** (`macromarkets`, `previsions`, `vault`) with light/dark token trees.
3. **Account / tenant-style switcher** in the authenticated header (`AccountSwitcher`) — Xip header is brand + search + user menu only.
4. **Environment toggle** (test/live) in header — Xip has no equivalent.
5. **Broader product shell** (wallets, assets, landing/docs) — Xip is a narrower ops admin.
6. **Redux-persisted session + richer public marketing shell** (PublicHeader/footer on public routes).

## What Xip has that Macro lacks (or is thinner)

1. **Email OTP login verify flow** as first-class admin auth (`/login` → `/login/verify`) with Mailpit e2e helpers.
2. **Forgot / reset password** admin routes wired to API proxies.
3. **Filament-inspired data tables** used across Users / Admins / Transactions (sort, pagination, filters, empty states).
4. **Roles + permission matrix** under Security (`/security/roles`) with edit/create flows.
5. **Transactions domain** list + detail (status chips, filters).
6. **RHF + Zod form system** and a larger reusable UI kit (page-header, confirm-dialog, status-tag, etc.).
7. **Forbidden / access-denied page** and explicit permission helpers in `lib/`.

## Feature matrix (admin-relevant)

| Capability | Macro | Xip | ACP Admin (this project) |
|------------|:-----:|:---:|:------------------------:|
| Login (no app header) | PublicHeader exists; not app chrome | Public header; not app chrome | Auth layout, **no app header** |
| Signup | Yes | No | Yes (Macro-style) |
| Forgot password | Recover flow | Yes | Yes |
| Change password | Profile/settings | Profile modal | Yes |
| OTP / 2FA | 2FA form | Email OTP at login; 2FA setup deferred | OTP + profile 2FA activation |
| Header search | Icon button | Header search | Search bar |
| Tenant / account select | AccountSwitcher | No | Tenant selector |
| User menu | ProfileButton | UserMenu | Yes |
| Notifications | Menu item | No dedicated inbox | Notifications sidebar + mark-as-read |
| Theme branding | Multi JSON themes | Single | Default / Ruby / Emerald packs + night mode |
| CRUD tables | Custom tables | DataTable + filters | Filament-inspired DataTable |
| Users CRUD | Accounts-oriented | Users + Admins | Users CRUD |
| Roles / permissions / menu tree | Menu components | Roles + permission matrix | Hierarchical tree editor |
| Tenants CRUD | Accounts | No | Tenants CRUD |
| Platform settings | Limited | Limited | AI / email / 3rd-party / logs submenus |
| Dashboard widgets | Assets-focused | Welcome + ops | Stats + charts + widget slots |
| Mock API | Real backend | Real Goravel API | json-server mocks |

## Patterns we copy from Macro (reference of truth)

- Auth screens as a **separate layout** from the dashboard shell.
- Header composition: **search + account/tenant switcher + profile/user menu**.
- Theme tokens as **named packs** with light/dark variants.
- Signup with password rules / strength feedback.
- Sidebar + sticky header shell for authenticated pages.

## Patterns we borrow from Xip

- Filament-like list tooling (page size, sorting, empty states, filter panel patterns).
- Roles/permissions admin screens.
- RHF + Zod validation discipline.
- OTP verify step in auth journeys.

## Patterns from slotbattle / ACP context

- `slotbattle-acp` remote was empty; from local `slotbattle` Makefile culture: explicit `make` targets for setup, test, and service orchestration — mirrored in this repo’s Makefile.

## Implications for ACP Admin v1

1. Ship **Signup** (Macro gap vs Xip) and full auth set including OTP.
2. Header must include **tenant selector + search + notifications + user menu**.
3. Theme system must ship **Default (sober blues), Ruby (red + black), Emerald (green)** + night mode.
4. Access area combines Macro shell ideas with Xip’s **roles/permissions** depth, plus **tenants** and an editable **menu tree**.
5. Stay **mocked** (json-server) — no real backend integration in v1.
6. Add a **brand-first public landing** (Macro-style public shell, ACP branding) separate from auth/app chrome.
7. Ship **Docusaurus docs** (`website/`) for Getting started, Components, API Server, and REST examples.
