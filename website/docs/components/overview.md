---
sidebar_position: 1
title: Overview
---

# Componentes (Components)

ACP Admin ships a small design-system layer inspired by Macro/Xip admin shells. Branding defaults to **Default** sober blues.

## Docs in this section

| Page | Contents |
|------|----------|
| [Forms](./forms) | RHF + Zod stack, inventory of real vs planned controls |
| [Form fields](./form-fields) | `Input`, `Select`, `Button`, `Modal`, layout helpers + props |
| [Form patterns](./form-patterns) | Login, OTP, checkboxes, password strength, modal CRUD |
| [DataTable](./data-table) | Global filter, filters panel, columns, sort, export, list page |
| [Menu tree](./menu-tree) | Access → Menu hierarchical editor with drag-and-drop |

## Layouts

| Component | Purpose |
|-----------|---------|
| `PublicLayout` | Landing + public nav (brand, docs, sign in) |
| `AuthLayout` | Login/Signup/OTP — **no app header** |
| `AppLayout` | Sidebar + sticky header (search, tenant, notifications, user menu) |

## UI primitives

| Component | Path |
|-----------|------|
| `Button` | `src/components/ui/Button.tsx` |
| `Input` | `src/components/ui/Input.tsx` |
| `Select` | `src/components/ui/Select.tsx` |
| `Card` | `src/components/ui/Card.tsx` |
| `Badge` | `src/components/ui/Badge.tsx` |
| `Modal` | `src/components/ui/Modal.tsx` |
| `PageHeader` | `src/components/ui/PageHeader.tsx` |

Native HTML is used for checkboxes. There are no exported `Checkbox`, `Switch`, `Textarea`, date, or file field components yet — see [Forms](./forms#what-exists-vs-planned).

## DataTable (Filament-inspired)

Located at `src/components/table/DataTable.tsx`. Full reference: [DataTable](./data-table).

Built-in tooling:

- Global table filter
- Filter panel slot
- Column picker
- Page size (persisted)
- Sortable columns
- Export callback
- Pagination

## Notifications

`NotificationsDrawer` — sidebar list with mark-as-read / mark-all-read against the mock API.

## Themes

Theme packs live in `src/config/themes`:

- **Default** (sober blues)
- **Ruby** (red + black)
- **Emerald** (green, Macro-like)

Each pack supports light + night mode via CSS variables.
