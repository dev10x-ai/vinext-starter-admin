---
sidebar_position: 1
title: Overview
---

# Componentes (Components)

ACP Admin ships a small design-system layer inspired by Macro/Xip admin shells. Branding defaults to **Default** sober blues.

Read this section **top to bottom** in the sidebar: Forms → Lists & tables → Menu tree → Layout.

## Suggested reading order

| Step | Page | Contents |
|------|------|----------|
| 1 | [Forms](./forms) | RHF + Zod stack and control inventory |
| 2 | [Form fields](./form-fields) | `Input`, `Select`, `Checkbox`, `Switch`, `Textarea`, date/file/OTP, layout helpers |
| 3 | [Form patterns](./form-patterns) | Login, OTP, checkboxes, password strength, modal CRUD |
| 4 | [Typography](./typography) | `Prose` wrapper + in-app showcase |
| 5 | [Lists & tables](./lists-and-tables) | Filament-inspired list-page mental model |
| 6 | [DataTable](./data-table) | Global filter, filters panel, columns, sort, export |
| 7 | [Menu tree](./menu-tree) | Access → Menu hierarchical editor with drag-and-drop |
| 8 | [Layout & chrome](./layout) | App header, command palette, route shells |

Prerequisites: [Concepts](../concepts) (Zustand + Query, themes, layouts). Start from the sidebar home for install steps.

## Layouts

| Component | Purpose |
|-----------|---------|
| `PublicLayout` | Landing + public nav (brand, docs, sign in) |
| `AuthLayout` | Login/Signup/OTP — **no app header** |
| `AppLayout` | Sidebar + sticky header (search, tenant, notifications, user menu) |

Details: [Layout & chrome](./layout).

## UI primitives

Barrel: `src/components/ui/index.ts`.

| Component | Path |
|-----------|------|
| `Button` | `src/components/ui/Button.tsx` |
| `Input` | `src/components/ui/Input.tsx` |
| `Select` | `src/components/ui/Select.tsx` |
| `Checkbox` | `src/components/ui/Checkbox.tsx` |
| `Switch` | `src/components/ui/Switch.tsx` |
| `Textarea` | `src/components/ui/Textarea.tsx` |
| `DatePicker` | `src/components/ui/DatePicker.tsx` |
| `FileUpload` | `src/components/ui/FileUpload.tsx` |
| `InputOTP` | `src/components/ui/InputOTP.tsx` |
| `Prose` | `src/components/ui/Prose.tsx` |
| `Card` | `src/components/ui/Card.tsx` |
| `Badge` | `src/components/ui/Badge.tsx` |
| `Modal` | `src/components/ui/Modal.tsx` |
| `PageHeader` | `src/components/ui/PageHeader.tsx` |

In-app showcases (sidebar → **Design System**):

- Typography / Prose: `/app/design-system/typography`
- Form fields: `/app/design-system/forms`

## DataTable (Filament-inspired)

Located at `src/components/table/DataTable.tsx`. Start with [Lists & tables](./lists-and-tables), then the full [DataTable](./data-table) reference.

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

Each pack supports light + night mode via CSS variables. See [Concepts → Themes](../concepts#themes).

## Next steps

Start with [Forms](./forms), then continue through fields, patterns, and [Lists & tables](./lists-and-tables).
