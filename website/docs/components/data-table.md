---
sidebar_position: 6
title: DataTable
---

# DataTable (search & list)

Part of **[Lists & tables](./lists-and-tables)** — the Filament-inspired research table at `src/components/table/DataTable.tsx`. Used on **Users** and **Tenants** list pages after you have forms for create/edit.

:::tip Reading order
[Forms](./forms) → [Form patterns](./form-patterns) → [Lists & tables](./lists-and-tables) → **this page** → [Menu tree](./menu-tree)
:::

## Features (actual)

| Feature | Behavior |
|---------|----------|
| Global filter | Client-side search over `JSON.stringify(row)` |
| Filters panel | Toggle button; renders `filterPanel` slot when open |
| Column picker | Checkbox list; respects `defaultVisible` |
| Page size | `10 / 25 / 50` in footer; persisted via Zustand `useUiStore.tablePrefs` |
| Sort | Click sortable column headers; toggles asc/desc |
| Export | Optional `onExport` callback (app usually downloads JSON) |
| Pagination | Footer: Showing X–Y of Z, rows-per-page, Prev / Next |
| Empty state | “No results” row |

There is **no** separate `FilterPanel`, `ColumnPicker`, or `TableToolbar` export — those are built into `DataTable`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column<T>[]` | **required** | Column definitions |
| `rows` | `T[]` | **required** | Data (already filtered by your page if needed) |
| `rowKey` | `(row: T) => string` | **required** | Stable React key |
| `filterPanel` | `ReactNode` | — | Content shown when **Filters** is open |
| `onExport` | `() => void` | — | If set, shows **Export** button |
| `searchPlaceholder` | `string` | `'Filter table…'` | Global search placeholder |

### `Column<T>`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `key` | `string` | — | Sort key (reads `row[key]` as string) + visibility id |
| `label` | `string` | — | Header label |
| `sortable` | `boolean` | `false` | Enables header sort control |
| `defaultVisible` | `boolean` | `true` | Initial column picker state (`false` hides) |
| `render` | `(row: T) => ReactNode` | — | Cell renderer |

```ts
export type Column<T> = {
  key: string
  label: string
  sortable?: boolean
  defaultVisible?: boolean
  render: (row: T) => ReactNode
}
```

## Toolbar & footer anatomy

```
[ Global filter Input ] [ Filters ] [ Columns ▾ ] [ Export? ]
         └── filterPanel (when Filters open)
[ table … ]
[ Showing X–Y of Z ] [ Rows per page ▾ ] [ Prev | Page x / y | Next ]
```

Page size lives in the **footer** (Filament-style) and is stored in `src/store/ui.ts` (`tablePrefs.pageSize`); it survives reloads via Zustand persist.

## Minimal example

```tsx
import { DataTable, type Column } from '@/components/table/DataTable'
import { Badge } from '@/components/ui/Badge'

type Row = { id: string; name: string; status: 'active' | 'inactive' }

const columns: Column<Row>[] = [
  { key: 'name', label: 'Name', sortable: true, render: (r) => r.name },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (r) => (
      <Badge tone={r.status === 'active' ? 'success' : 'warning'}>{r.status}</Badge>
    ),
  },
]

const rows: Row[] = [
  { id: '1', name: 'Ada', status: 'active' },
  { id: '2', name: 'Sam', status: 'inactive' },
]

export function SimpleTable() {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      searchPlaceholder="Search users…"
      onExport={() => {
        const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'rows.json'
        a.click()
      }}
    />
  )
}
```

## Filter panel + external filter state

`DataTable` does **not** own domain filters. Keep filter state on the page, pass a narrowed `rows` array, and put controls in `filterPanel` (see `UsersPage`):

```tsx
import { useMemo, useState } from 'react'
import { DataTable, type Column } from '@/components/table/DataTable'
import { Select } from '@/components/ui/Select'

type User = { id: string; name: string; email: string; status: 'active' | 'inactive' }

export function FilteredTable({ users }: { users: User[] }) {
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = useMemo(
    () => (statusFilter === 'all' ? users : users.filter((u) => u.status === statusFilter)),
    [users, statusFilter],
  )

  const columns: Column<User>[] = [
    { key: 'name', label: 'Name', sortable: true, render: (u) => u.name },
    { key: 'email', label: 'Email', sortable: true, render: (u) => u.email },
    { key: 'status', label: 'Status', sortable: true, render: (u) => u.status },
  ]

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(u) => u.id}
      filterPanel={
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      }
    />
  )
}
```

## Full list page pattern

Copy-paste oriented skeleton combining `PageHeader`, Query hooks, `DataTable`, and modal form (mirrors Users / Tenants):

```tsx
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/table/DataTable'

type Tenant = {
  id: string
  name: string
  slug: string
  plan: string
  status: 'active' | 'suspended'
  usersCount: number
}

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  plan: z.string().min(1),
  status: z.enum(['active', 'suspended']),
})

type Form = z.infer<typeof schema>

export function TenantsListPage({
  tenants,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
}: {
  tenants: Tenant[]
  isLoading?: boolean
  onCreate: (values: Form) => Promise<void>
  onUpdate: (id: string, values: Form) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Tenant | null>(null)
  const [planFilter, setPlanFilter] = useState('all')
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { plan: 'starter', status: 'active' },
  })

  const rows = useMemo(
    () => (planFilter === 'all' ? tenants : tenants.filter((t) => t.plan === planFilter)),
    [tenants, planFilter],
  )

  const columns: Column<Tenant>[] = [
    { key: 'name', label: 'Name', sortable: true, render: (t) => t.name },
    { key: 'slug', label: 'Slug', sortable: true, render: (t) => t.slug },
    { key: 'plan', label: 'Plan', sortable: true, render: (t) => t.plan },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (t) => (
        <Badge tone={t.status === 'active' ? 'success' : 'danger'}>{t.status}</Badge>
      ),
    },
    { key: 'usersCount', label: 'Users', sortable: true, render: (t) => t.usersCount },
    {
      key: 'actions',
      label: 'Actions',
      defaultVisible: true,
      render: (t) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditing(t)
              form.reset({
                name: t.name,
                slug: t.slug,
                plan: t.plan,
                status: t.status,
              })
              setOpen(true)
            }}
          >
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => void onDelete(t.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Tenants"
        description="Organization CRUD with export and filters."
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              form.reset({ name: '', slug: '', plan: 'starter', status: 'active' })
              setOpen(true)
            }}
          >
            New tenant
          </Button>
        }
      />

      {isLoading ? (
        <p className="mb-3 text-sm text-[var(--color-text-muted)]">Loading…</p>
      ) : null}

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(t) => t.id}
        searchPlaceholder="Filter tenants…"
        filterPanel={
          <div className="grid gap-3 md:grid-cols-2">
            <Select
              label="Plan"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All plans' },
                { value: 'starter', label: 'Starter' },
                { value: 'growth', label: 'Growth' },
                { value: 'enterprise', label: 'Enterprise' },
              ]}
            />
          </div>
        }
        onExport={() => {
          const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'tenants.json'
          a.click()
        }}
      />

      <Modal
        open={open}
        title={editing ? 'Edit tenant' : 'New tenant'}
        onClose={() => setOpen(false)}
        footer={
          <Button
            onClick={form.handleSubmit(async (values) => {
              if (editing) await onUpdate(editing.id, values)
              else await onCreate(values)
              setOpen(false)
            })}
          >
            Save
          </Button>
        }
      >
        <form className="space-y-3">
          <Input label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
          <Input label="Slug" error={form.formState.errors.slug?.message} {...form.register('slug')} />
          <Select
            label="Plan"
            options={[
              { value: 'starter', label: 'Starter' },
              { value: 'growth', label: 'Growth' },
              { value: 'enterprise', label: 'Enterprise' },
            ]}
            {...form.register('plan')}
          />
          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' },
            ]}
            {...form.register('status')}
          />
        </form>
      </Modal>
    </div>
  )
}
```

Wire `onCreate` / `onUpdate` / `onDelete` to TanStack Query mutations (`useCreateTenantMutation`, etc.) as in `src/pages/access/TenantsPage.tsx`.

## Sorting notes

- Sort compares `String(row[sortKey])` with `localeCompare`.
- Nested fields or custom sort accessors are **not** supported — put a flat sortable field on the row or sort before passing `rows`.
- Action columns should omit `sortable` (or leave it unset).

## Column visibility

```tsx
{
  key: 'internalId',
  label: 'Internal ID',
  defaultVisible: false,
  render: (r) => r.id,
}
```

Users can re-enable hidden columns from the **Columns** dropdown.

## What is not exported

| Name | Status |
|------|--------|
| Standalone `FilterPanel` | Built into `DataTable` via `filterPanel` prop |
| Standalone `ColumnPicker` | Built into toolbar |
| Server-side pagination / sort API | Client-side only on current `rows` |
| CSV export helper | Call sites implement `onExport` (JSON blob is the common pattern) |
| Row selection / bulk actions | Not implemented |

## Next steps

1. [Menu tree](./menu-tree) — hierarchical DnD editor (Access → Menu)  
2. [Layout & chrome](./layout) — header search / command palette  
3. [API Server](../api/server) — REST behind list CRUD and search  

Related: [Form patterns → Modal CRUD](./form-patterns#modal-crud-users). Live pages: `src/pages/access/UsersPage.tsx`, `TenantsPage.tsx`.
