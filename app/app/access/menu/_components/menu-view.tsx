'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Modal } from '@/components/ui/Modal'
import { IconPicker } from '@/components/menu/IconPicker'
import { MenuTree } from '@/components/menu/MenuTree'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  useMenuQuery,
  useReorderMenuMutation,
  useUpdateMenuItemMutation,
} from '@/queries'
import { applyReorderPatches } from '@/lib/menuTree'
import type { MenuItem } from '@/types'

/** Matches Tailwind `lg` — side-by-side tree + edit panel. */
const WIDE_LAYOUT_QUERY = '(min-width: 1024px)'

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  path: z.string().optional(),
  icon: z.string(),
  enabled: z.boolean(),
})

type Form = z.infer<typeof schema>

export function MenuView() {
  const isWideLayout = useMediaQuery(WIDE_LAYOUT_QUERY)
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
    defaultValues: { label: '', path: '', icon: '', enabled: true },
  })

  useEffect(() => {
    if (!selected) return
    form.reset({
      label: selected.label,
      path: selected.path ?? '',
      icon: selected.icon ?? '',
      enabled: selected.enabled,
    })
  }, [selected, form])

  const closeEditor = () => {
    setSelectedId(null)
  }

  const saving = updateItem.isPending || form.formState.isSubmitting

  const onSubmit = form.handleSubmit(async (values) => {
    if (!selected) {
      throw new Error('MenuView: cannot save without a selected menu item')
    }
    await updateItem.mutateAsync({
      id: selected.id,
      body: {
        ...selected,
        label: values.label,
        path: values.path?.trim() ? values.path.trim() : null,
        icon: values.icon,
        enabled: values.enabled,
      },
    })
  })

  const editFields = selected ? (
    <MenuItemEditFields form={form} selected={selected} saving={saving} />
  ) : null

  return (
    <div>
      <PageHeader
        title="Menu tree"
        description="Drag items to reorder siblings or nest under another node. Expand/collapse groups as needed."
      />
      {isLoading ? (
        <p className="mb-3 text-sm text-[var(--color-text-muted)]">Loading menu…</p>
      ) : null}

      <div className={isWideLayout ? 'grid grid-cols-2 gap-4' : undefined}>
        <Card>
          <p className="mb-3 text-xs text-[var(--color-text-muted)]">
            Use the grip to drag. Drag right to nest under the previous sibling; drag left to promote.
            {!isWideLayout ? ' Tap a node to edit.' : null}
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

        {isWideLayout ? (
          <Card>
            {selected && editFields ? (
              <form className="space-y-3" onSubmit={onSubmit}>
                {editFields}
                <Button type="submit" disabled={saving}>
                  Save item
                </Button>
              </form>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">Select a menu node to edit.</p>
            )}
          </Card>
        ) : null}
      </div>

      {!isWideLayout ? (
        <Modal
          open={Boolean(selected)}
          title={selected ? `Edit · ${selected.label}` : 'Edit menu item'}
          onClose={closeEditor}
          footer={
            selected ? (
              <>
                <Button type="button" variant="ghost" onClick={closeEditor} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" form="menu-item-edit-form" disabled={saving}>
                  Save item
                </Button>
              </>
            ) : undefined
          }
        >
          {selected && editFields ? (
            <form id="menu-item-edit-form" className="space-y-3" onSubmit={onSubmit}>
              {editFields}
            </form>
          ) : null}
        </Modal>
      ) : null}
    </div>
  )
}

function MenuItemEditFields({
  form,
  selected,
  saving,
}: {
  form: UseFormReturn<Form>
  selected: MenuItem
  saving: boolean
}): ReactNode {
  if (!selected?.id) {
    throw new Error('MenuItemEditFields requires a selected menu item')
  }

  return (
    <>
      <Input
        label="Label"
        error={form.formState.errors.label?.message}
        {...form.register('label')}
      />
      <Input label="Path" {...form.register('path')} />
      <Controller
        name="icon"
        control={form.control}
        render={({ field, fieldState }) => (
          <IconPicker
            value={field.value}
            onChange={field.onChange}
            disabled={saving}
            error={fieldState.error?.message}
          />
        )}
      />
      <Checkbox label="Enabled" {...form.register('enabled')} />
      <p className="text-xs text-[var(--color-text-muted)]">
        parentId: {selected.parentId ?? 'null'} · order: {selected.order}
      </p>
    </>
  )
}