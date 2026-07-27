---
sidebar_position: 7
title: Menu tree
---

# Menu tree (Access → Menu)

After flat list pages ([DataTable](./data-table)), the Access **Menu** page (`/app/access/menu`) edits the hierarchical navigation model with drag-and-drop.

## Libraries

- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

Tree math lives in `lib/menuTree.ts`; the interactive list is `components/menu/MenuTree.tsx`.

## Data shape

Each menu row:

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | Stable id |
| `label` | string | Display name |
| `path` | string \| null | Route (null for group nodes) |
| `icon` | string | Icon key |
| `parentId` | string \| null | `null` = root |
| `order` | integer | Sibling sort key (1-based per parent) |
| `enabled` | boolean | Soft-disable flag |

There is no separate `sortOrder` field — use **`order`**.

## Interactions

- **Expand / collapse** chevron on nodes with children
- **Drag handle** (grip) to reorder among siblings
- **Reparent**: drag right while over a drop target to nest under the previous sibling; drag left to promote
- **Edit** panel (right): label, path, enabled — `PATCH /menu/:id`
- **Persist order**: `POST /menu/reorder` with `{ items: [{ id, parentId, order }, ...] }`

## Try it

1. `make dev`
2. Sign in → **Access → Menu tree**
3. Drag **Tenants** above **Users** (sibling reorder under Access)
4. Drag **Alerts** right onto **Reports** to nest it
5. Refresh — order should stick (mock `db.json` is updated by json-server)

## Manual verification

- [ ] Expand/collapse **Insights → Reports**
- [ ] Sibling reorder persists after refresh
- [ ] Nesting updates `parentId` in the edit panel
- [ ] Saving label/path still works after a drag

## Next steps

- [Layout & chrome](./layout) — app header and command palette  
- [API Server](../api/server) — `GET/PATCH /menu`, `POST /menu/reorder`  
- Or return to [Components overview](./overview)
