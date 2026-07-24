import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { usePermissionsQuery, useRolesQuery, useUpdateRoleMutation } from '@/queries'
import type { Role } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
  permissions: z.array(z.string()),
})

type Form = z.infer<typeof schema>

export function RolesPage() {
  const { data: roles = [], isLoading: rolesLoading } = useRolesQuery()
  const { data: permissions = [], isLoading: permsLoading } = usePermissionsQuery()
  const updateRole = useUpdateRoleMutation()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = useMemo(
    () => roles.find((r) => r.id === selectedId) ?? roles[0] ?? null,
    [roles, selectedId],
  )

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', permissions: [] },
  })

  useEffect(() => {
    if (!selected) return
    form.reset({
      name: selected.name,
      description: selected.description,
      permissions: selected.permissions,
    })
  }, [selected, form])

  const groups = [...new Set(permissions.map((p) => p.group))]
  const watchedPermissions = form.watch('permissions')

  const togglePerm = (key: string) => {
    const current = form.getValues('permissions')
    const next = current.includes(key) ? current.filter((p) => p !== key) : [...current, key]
    form.setValue('permissions', next, { shouldDirty: true })
  }

  const onSelectRole = (role: Role) => {
    setSelectedId(role.id)
  }

  return (
    <div>
      <PageHeader title="Roles & permissions" description="Edit role permission sets (mocked)." />
      {rolesLoading || permsLoading ? (
        <p className="mb-3 text-sm text-[var(--color-text-muted)]">Loading roles…</p>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="space-y-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm ${selected?.id === r.id ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'hover:bg-[var(--color-accent)]'}`}
            >
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{r.key}</div>
            </button>
          ))}
        </Card>
        {selected ? (
          <Card>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(async (values) => {
                await updateRole.mutateAsync({
                  id: selected.id,
                  body: {
                    name: values.name,
                    permissions: values.permissions,
                    description: values.description,
                    key: selected.key,
                  },
                })
              })}
            >
              <Input label="Role name" error={form.formState.errors.name?.message} {...form.register('name')} />
              <Textarea
                label="Description"
                hint="Shown to operators when assigning this role"
                error={form.formState.errors.description?.message}
                {...form.register('description')}
              />
              <div className="space-y-4">
                {groups.map((g) => (
                  <div key={g}>
                    <h3 className="mb-2 text-sm font-semibold">{g}</h3>
                    <div className="space-y-2">
                      {permissions
                        .filter((p) => p.group === g)
                        .map((p) => (
                          <Checkbox
                            key={p.id}
                            label={`${p.label} (${p.key})`}
                            checked={watchedPermissions.includes(p.key)}
                            onChange={() => togglePerm(p.key)}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button type="submit" disabled={updateRole.isPending || form.formState.isSubmitting}>
                Save role
              </Button>
            </form>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
