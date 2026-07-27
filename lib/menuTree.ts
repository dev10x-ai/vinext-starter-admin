import type { MenuItem } from '@/types'

export type MenuTreeNode = MenuItem & {
  children: MenuTreeNode[]
}

export type FlattenedMenuItem = MenuItem & {
  depth: number
  index: number
  parentId: string | null
}

export type MenuReorderPatch = {
  id: string
  parentId: string | null
  order: number
}

const INDENTATION_WIDTH = 24

export function buildMenuTree(items: MenuItem[]): MenuTreeNode[] {
  if (!Array.isArray(items)) {
    throw new Error('buildMenuTree: items must be an array')
  }

  const byParent = new Map<string | null, MenuItem[]>()
  for (const item of items) {
    if (!item?.id) {
      throw new Error('buildMenuTree: each item requires an id')
    }
    const key = item.parentId ?? null
    const siblings = byParent.get(key) ?? []
    siblings.push(item)
    byParent.set(key, siblings)
  }

  const sortSiblings = (list: MenuItem[]) =>
    [...list].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))

  const walk = (parentId: string | null): MenuTreeNode[] => {
    const siblings = sortSiblings(byParent.get(parentId) ?? [])
    return siblings.map((item) => ({
      ...item,
      children: walk(item.id),
    }))
  }

  return walk(null)
}

export function flattenMenuTree(
  nodes: MenuTreeNode[],
  parentId: string | null = null,
  depth = 0,
): FlattenedMenuItem[] {
  return nodes.reduce<FlattenedMenuItem[]>((acc, node, index) => {
    acc.push({
      id: node.id,
      label: node.label,
      path: node.path,
      icon: node.icon,
      parentId,
      order: node.order,
      enabled: node.enabled,
      depth,
      index,
    })
    acc.push(...flattenMenuTree(node.children, node.id, depth + 1))
    return acc
  }, [])
}

export function getDescendantIds(items: FlattenedMenuItem[], rootId: string): string[] {
  const ids: string[] = []
  const start = items.findIndex((item) => item.id === rootId)
  if (start < 0) return ids

  const rootDepth = items[start].depth
  for (let i = start + 1; i < items.length; i += 1) {
    if (items[i].depth <= rootDepth) break
    ids.push(items[i].id)
  }
  return ids
}

export function removeChildrenOf(
  items: FlattenedMenuItem[],
  ids: string[],
): FlattenedMenuItem[] {
  const exclude = new Set(ids)
  return items.filter((item) => !exclude.has(item.id))
}

type Projection = {
  depth: number
  maxDepth: number
  minDepth: number
  parentId: string | null
}

export function getDragProjection(
  items: FlattenedMenuItem[],
  activeId: string,
  overId: string,
  dragOffsetX: number,
  indentationWidth = INDENTATION_WIDTH,
): Projection | null {
  if (!activeId || !overId) {
    throw new Error('getDragProjection: activeId and overId are required')
  }

  const overIndex = items.findIndex((item) => item.id === overId)
  const activeIndex = items.findIndex((item) => item.id === activeId)
  if (overIndex < 0 || activeIndex < 0) return null

  const activeItem = items[activeIndex]
  const newItems = [...items]
  const [removed] = newItems.splice(activeIndex, 1)
  newItems.splice(overIndex, 0, removed)

  const previousItem = newItems[overIndex - 1]
  const nextItem = newItems[overIndex + 1]
  const dragDepth = Math.round(dragOffsetX / indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth

  const maxDepth = previousItem ? previousItem.depth + 1 : 0
  const minDepth = nextItem ? nextItem.depth : 0
  const depth = Math.max(minDepth, Math.min(projectedDepth, maxDepth))

  return {
    depth,
    maxDepth,
    minDepth,
    parentId: getParentIdForDepth(newItems, overIndex, depth),
  }
}

function getParentIdForDepth(
  items: FlattenedMenuItem[],
  overIndex: number,
  depth: number,
): string | null {
  if (depth === 0 || overIndex === 0) return null

  const previous = items[overIndex - 1]
  if (depth === previous.depth) return previous.parentId
  if (depth > previous.depth) return previous.id

  for (let i = overIndex - 1; i >= 0; i -= 1) {
    if (items[i].depth === depth) return items[i].parentId
  }
  return null
}

export function applyMenuProjection(
  items: FlattenedMenuItem[],
  activeId: string,
  overId: string,
  depth: number,
  parentId: string | null,
): FlattenedMenuItem[] {
  const activeIndex = items.findIndex((item) => item.id === activeId)
  const overIndex = items.findIndex((item) => item.id === overId)
  if (activeIndex < 0 || overIndex < 0) {
    throw new Error('applyMenuProjection: active or over item not found')
  }

  const next = [...items]
  const [active] = next.splice(activeIndex, 1)
  next.splice(overIndex, 0, { ...active, depth, parentId })
  return next
}

export function flattenToReorderPatches(items: FlattenedMenuItem[]): MenuReorderPatch[] {
  const orderByParent = new Map<string | null, number>()
  return items.map((item) => {
    const key = item.parentId
    const order = (orderByParent.get(key) ?? 0) + 1
    orderByParent.set(key, order)
    return {
      id: item.id,
      parentId: item.parentId,
      order,
    }
  })
}

export function applyReorderPatches(
  items: MenuItem[],
  patches: MenuReorderPatch[],
): MenuItem[] {
  if (!Array.isArray(items) || !Array.isArray(patches)) {
    throw new Error('applyReorderPatches: items and patches must be arrays')
  }

  const byId = new Map(patches.map((patch) => [patch.id, patch]))
  return items.map((item) => {
    const patch = byId.get(item.id)
    if (!patch) return item
    return {
      ...item,
      parentId: patch.parentId,
      order: patch.order,
    }
  })
}

export { INDENTATION_WIDTH }
