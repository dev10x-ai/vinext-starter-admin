---
sidebar_position: 5
title: Lists & tables
---

# Lists & tables

Filament-inspired **list pages**: a page header, a research table (search, filters, columns, export, pagination), and optional create/edit forms in a modal.

This is the pattern used on **Users** and **Tenants** (`app/app/access/`).

## Why this section exists

After [Forms](./forms), the next building block is the **index / list** screen. Forms handle create and edit; lists handle discovery, filtering, and bulk-oriented tooling. [DataTable](./data-table) is the shared component for that list surface — not a standalone widget floating outside the admin UX.

## Anatomy of a list page

```
PageHeader (title, description, “New …” action)
    │
    ▼
DataTable
  ├── toolbar: global filter · Filters · Columns · Export?
  ├── filterPanel slot (page-owned domain filters)
  ├── sortable rows
  └── footer: range · page size · Prev / Next
    │
    ▼
Modal + RHF form (create / edit)  ← see Form patterns
```

| Piece | Responsibility |
|-------|----------------|
| Page | Query data, own filter state, wire mutations |
| `DataTable` | Search, column visibility, sort, page size, export button |
| Modal form | Create/edit — same RHF + Zod stack as [Forms](./forms) |

Domain filters (status, plan, …) stay on the **page**. Pass a narrowed `rows` array into DataTable and put controls in `filterPanel`.

## Reading order

1. **This page** — mental model  
2. [DataTable](./data-table) — props, toolbar, full list-page skeleton  
3. [Form patterns → Modal CRUD](./form-patterns#modal-crud-users) — forms that sit beside the table  

## Next steps

- Continue with the [DataTable](./data-table) reference  
- Or jump to [Menu tree](./menu-tree) for hierarchical DnD editing (a different list-like surface)
