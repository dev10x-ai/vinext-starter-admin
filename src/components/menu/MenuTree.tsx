import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  defaultDropAnimation,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  INDENTATION_WIDTH,
  applyMenuProjection,
  buildMenuTree,
  flattenMenuTree,
  flattenToReorderPatches,
  getDescendantIds,
  getDragProjection,
  removeChildrenOf,
  type FlattenedMenuItem,
  type MenuReorderPatch,
} from '@/lib/menuTree'
import type { MenuItem } from '@/types'

type MenuTreeProps = {
  items: MenuItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (patches: MenuReorderPatch[]) => void
  disabled?: boolean
}

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
}

export function MenuTree({
  items,
  selectedId,
  onSelect,
  onReorder,
  disabled = false,
}: MenuTreeProps) {
  if (!Array.isArray(items)) {
    throw new Error('MenuTree: items must be an array')
  }

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const tree = useMemo(() => buildMenuTree(items), [items])
  const flattened = useMemo(() => flattenMenuTree(tree), [tree])

  const visibleItems = useMemo(() => {
    const collapsedIds = Object.entries(collapsed)
      .filter(([, isCollapsed]) => isCollapsed)
      .map(([id]) => id)
    const hidden = collapsedIds.flatMap((id) => getDescendantIds(flattened, id))
    return removeChildrenOf(flattened, hidden)
  }, [collapsed, flattened])

  const projected =
    activeId && overId
      ? getDragProjection(
          visibleItems,
          String(activeId),
          String(overId),
          offsetLeft,
        )
      : null

  const sortedIds = useMemo(
    () => visibleItems.map((item) => item.id),
    [visibleItems],
  )

  const activeItem = activeId
    ? flattened.find((item) => item.id === activeId) ?? null
    : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const resetDrag = () => {
    setActiveId(null)
    setOverId(null)
    setOffsetLeft(0)
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (disabled) return
    setActiveId(active.id)
    setOverId(active.id)
  }

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x)
  }

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over?.id ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetDrag()
    if (disabled || !over || !projected) return

    const activeItemId = String(active.id)
    const overItemId = String(over.id)
    const descendants = getDescendantIds(flattened, activeItemId)
    if (descendants.includes(overItemId)) return

    const nextFlat = applyMenuProjection(
      flattened,
      activeItemId,
      overItemId,
      projected.depth,
      projected.parentId,
    )
    const patches = flattenToReorderPatches(nextFlat)
    onReorder(patches)
  }

  const handleDragCancel = () => {
    resetDrag()
  }

  const toggleCollapsed = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <ul className="space-y-0.5" role="tree" aria-label="Menu hierarchy">
          {visibleItems.map((item) => (
            <SortableMenuRow
              key={item.id}
              item={item}
              depth={
                item.id === activeId && projected ? projected.depth : item.depth
              }
              indentationWidth={INDENTATION_WIDTH}
              collapsed={Boolean(collapsed[item.id])}
              hasChildren={flattened.some(
                (candidate) => candidate.parentId === item.id,
              )}
              selected={selectedId === item.id}
              indicator={Boolean(
                projected && overId === item.id && activeId !== item.id,
              )}
              disabled={disabled}
              onSelect={() => onSelect(item.id)}
              onToggle={() => toggleCollapsed(item.id)}
            />
          ))}
        </ul>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeItem ? (
          <MenuRowPreview item={activeItem} depth={activeItem.depth} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

type SortableMenuRowProps = {
  item: FlattenedMenuItem
  depth: number
  indentationWidth: number
  collapsed: boolean
  hasChildren: boolean
  selected: boolean
  indicator: boolean
  disabled: boolean
  onSelect: () => void
  onToggle: () => void
}

function SortableMenuRow({
  item,
  depth,
  indentationWidth,
  collapsed,
  hasChildren,
  selected,
  indicator,
  disabled,
  onSelect,
  onToggle,
}: SortableMenuRowProps) {
  const {
    attributes,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <li
      ref={setDroppableNodeRef}
      className="list-none"
      role="treeitem"
      aria-selected={selected}
      aria-expanded={hasChildren ? !collapsed : undefined}
    >
      <div
        ref={setDraggableNodeRef}
        style={{ ...style, paddingLeft: `${depth * indentationWidth}px` }}
        className={cn(
          'group relative flex items-center gap-1 rounded-md border border-transparent',
          isDragging && 'opacity-40',
          indicator && 'border-[var(--color-primary)] bg-[var(--color-accent)]',
        )}
      >
        {indicator ? (
          <span
            className="pointer-events-none absolute -top-px left-0 right-0 h-0.5 rounded-full bg-[var(--color-primary)]"
            style={{ marginLeft: `${depth * indentationWidth}px` }}
            aria-hidden
          />
        ) : null}
        <button
          type="button"
          className={cn(
            'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-[var(--color-text-muted)]',
            'cursor-grab touch-none hover:bg-[var(--color-accent)] active:cursor-grabbing',
            disabled && 'cursor-not-allowed opacity-40',
          )}
          aria-label={`Drag ${item.label}`}
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} />
        </button>
        {hasChildren ? (
          <button
            type="button"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-[var(--color-text-muted)] hover:bg-[var(--color-accent)]"
            aria-label={collapsed ? `Expand ${item.label}` : `Collapse ${item.label}`}
            onClick={onToggle}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>
        ) : (
          <span className="inline-flex h-7 w-7 shrink-0" aria-hidden />
        )}
        <button
          type="button"
          className={cn(
            'flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm',
            'hover:bg-[var(--color-accent)]',
            selected && 'bg-[var(--color-accent)] font-medium',
          )}
          onClick={onSelect}
        >
          <span className="truncate">{item.label}</span>
          {!item.enabled ? (
            <span className="shrink-0 text-xs text-[var(--color-warning)]">disabled</span>
          ) : null}
          {item.path ? (
            <span className="ml-auto truncate text-xs text-[var(--color-text-muted)]">
              {item.path}
            </span>
          ) : null}
        </button>
      </div>
    </li>
  )
}

function MenuRowPreview({
  item,
  depth,
}: {
  item: FlattenedMenuItem
  depth: number
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-md border border-[var(--color-primary)] bg-[var(--color-card)] px-1 py-0.5 shadow-md"
      style={{ paddingLeft: `${depth * INDENTATION_WIDTH}px` }}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center text-[var(--color-text-muted)]">
        <GripVertical size={14} />
      </span>
      <span className="px-2 py-1.5 text-sm font-medium">{item.label}</span>
    </div>
  )
}
