import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MenuTree } from '@/components/menu/MenuTree'
import {
  useMenuQuery,
  useReorderMenuMutation,
  useUpdateMenuItemMutation,
} from '@/queries'
import { applyReorderPatches } from '@/lib/menuTree'
import type { MenuItem } from '@/types'

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  path: z.string().optional(),
  enabled: z.boolean(),
})

type Form = z.infer<typeof schema>

export function MenuPage() {
  const { data: items = [], isLoading } = useMenuQuery()
  const updateItem = useUpdateMenuItemMutation()
  const reorderMenu = useReorderMenuMutation()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [optimisticItems, setOptimisticItems] = useState<MenuItem[] | null>(null)

  const displayItems = optimisticItems ?? items

  useEffect(() => {
    setOptimisticItems(null)
  }, [items])

  const selected = displayItems.find((i) => i.id === selectedId) ?? null
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { label: '', path: '', enabled: true },
  })

  useEffect(() => {
    if (!selected) return
    form.reset({
      label: selected.label,
      path: selected.path ?? '',
      enabled: selected.enabled,
    })
  }, [selected, form])

  return (
    <div>
      <PageHeader
        title="Menu tree"
        description="Drag items to reorder siblings or nest under another node. Expand/collapse groups as needed."
      />
      {isLoading ? (
        <p className="mb-3 text-sm text-[var(--color-text-muted)]">Loading menu…</p>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-3 text-xs text-[var(--color-text-muted)]">
            Use the grip to drag. Drag right to nest under the previous sibling; drag left to promote.
          </p>
          <MenuTree
            items={displayItems}
            selectedId={selectedId}
            disabled={reorderMenu.isPending}
            onSelect={setSelectedId}
            onReorder={(patches) => {
              setOptimisticItems(applyReorderPatches(displayItems, patches))
              void reorderMenu.mutateAsync(patches).catch(() => {
                setOptimisticItems(null)
              })
            }}
          />
        </Card>
        <Card>
          {selected ? (
            <form
              className="space-y-3"
              onSubmit={form.handleSubmit(async (values) => {
                await updateItem.mutateAsync({
                  id: selected.id,
                  body: {
                    ...selected,
                    label: values.label,
                    path: values.path?.trim() ? values.path.trim() : null,
                    enabled: values.enabled,
                  },
                })
              })}
            >
              <Input
                label="Label"
                error={form.formState.errors.label?.message}
                {...form.register('label')}
              />
              <Input label="Path" {...form.register('path')} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register('enabled')} />
                Enabled
              </label>
              <p className="text-xs text-[var(--color-text-muted)]">
                parentId: {selected.parentId ?? 'null'} · order: {selected.order}
              </p>
              <Button type="submit" disabled={updateItem.isPending || form.formState.isSubmitting}>
                Save item
              </Button>
            </form>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">Select a menu node to edit.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
