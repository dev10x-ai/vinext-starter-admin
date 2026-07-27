---
sidebar_position: 8
title: Layout & chrome
---

# Layout & chrome

Shell pieces that wrap console pages: layouts, sticky header, and the command palette search.

## Layouts

| Component | Path | Purpose |
|-----------|------|---------|
| `PublicLayout` | `layouts/PublicLayout.tsx` | Landing + public nav |
| `AuthLayout` | `layouts/AuthLayout.tsx` | Login / Signup / OTP — **no** app header |
| `AppLayout` | `layouts/AppLayout.tsx` | Sidebar + sticky header for `/app/*` |

See [Concepts](../concepts#routing--layouts) for when each shell applies.

## App header

**Path:** `components/layout/AppHeader.tsx`

Sticky bar inside `AppLayout`:

1. **Tenant switcher** — active organization  
2. **Global search** — opens the command palette  
3. **Notifications** — bell → `NotificationsDrawer`  
4. **User menu** — profile, theme, sign out  

## Command palette

**Paths:** `components/search/GlobalSearch.tsx`, `CommandPalette.tsx`

- Header search field (and keyboard shortcut) opens a modal palette  
- Queries `GET /search?q=` via TanStack Query (`useSearchQuery`)  
- Groups results (users, tenants, settings) and navigates to `result.url`  
- Empty query can return suggestions from the mock API  

Try it: sign in → focus the header search (or use the palette shortcut) → type a user or setting name.

## Page-level chrome

Inside a route, prefer:

- `PageHeader` — title, description, primary actions  
- `Card` — form / settings sections  

These are documented with forms under [Form fields](./form-fields#card--pageheader--badge).

## Next steps

- Back to [Components overview](./overview) if you want the full map  
- Or continue to [API Server](../api/server) for the mock contract behind search and CRUD
