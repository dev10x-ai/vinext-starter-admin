import { useEffect } from 'react'
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
import { useModalRoute } from '@/hooks/useModalRoute'
import {
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useTenantQuery,
  useTenantsQuery,
  useUpdateTenantMutation,
} from '@/queries'
import { toast } from '@/store/toast'
import type { Tenant } from '@/types'

const TENANTS_LIST_PATH = '/app/access/tenants'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  plan: z.string().min(1),
  status: z.enum(['active', 'suspended']),
})
type Form = z.infer<typeof schema>

const CREATE_DEFAULTS: Form = { name: '', slug: '', plan: 'starter', status: 'active' }

export function TenantsPage() {
  const { data: tenants = [], isLoading } = useTenantsQuery()
  const createTenant = useCreateTenantMutation()
  const updateTenant = useUpdateTenantMutation()
  const deleteTenant = useDeleteTenantMutation()
  const { mode, entityId, open, openCreate, openEdit, close } = useModalRoute(TENANTS_LIST_PATH)
  const {
    data: editingTenant,
    isLoading: isLoadingTenant,
    isError: isTenantError,
    error: tenantError,
  } = useTenantQuery(mode === 'edit' ? entityId : null)

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { plan: 'starter', status: 'active' },
  })

  useEffect(() => {
    if (mode === 'create') {
      form.reset(CREATE_DEFAULTS)
      return
    }
    if (mode === 'edit' && editingTenant) {
      form.reset({
        name: editingTenant.name,
        slug: editingTenant.slug,
        plan: editingTenant.plan,
        status: editingTenant.status === 'suspended' ? 'suspended' : 'active',
      })
    }
  }, [mode, editingTenant, form])

  useEffect(() => {
    if (mode !== 'edit' || !isTenantError) return
    toast.error(tenantError instanceof Error ? tenantError.message : 'Tenant not found')
    close()
  }, [mode, isTenantError, tenantError, close])

  const columns: Column<Tenant>[] = [
    { key: 'name', label: 'Name', sortable: true, render: (t) => t.name },
    { key: 'slug', label: 'Slug', sortable: true, render: (t) => t.slug },
    { key: 'plan', label: 'Plan', sortable: true, render: (t) => t.plan },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (t) => <Badge tone={t.status === 'active' ? 'success' : 'danger'}>{t.status}</Badge>,
    },
    { key: 'usersCount', label: 'Users', sortable: true, render: (t) => t.usersCount },
    {
      key: 'actions',
      label: 'Actions',
      render: (t) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => openEdit(t.id)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={deleteTenant.isPending}
            onClick={() => void deleteTenant.mutateAsync(t.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const modalTitle = mode === 'edit' ? 'Edit tenant' : 'New tenant'
  const canSubmit =
    mode === 'create' || (mode === 'edit' && Boolean(editingTenant) && !isLoadingTenant)

  return (
    <div>
      <PageHeader
        title="Tenants"
        description="Organization CRUD with export and filters."
        actions={<Button onClick={openCreate}>New tenant</Button>}
      />
      {isLoading ? <p className="mb-3 text-sm text-[var(--color-text-muted)]">Loading tenants…</p> : null}
      <DataTable
        columns={columns}
        rows={tenants}
        rowKey={(t) => t.id}
        onExport={() => {
          const blob = new Blob([JSON.stringify(tenants, null, 2)], { type: 'application/json' })
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'tenants.json'
          a.click()
        }}
      />
      <Modal
        open={open}
        title={modalTitle}
        onClose={close}
        footer={
          <Button
            disabled={!canSubmit || createTenant.isPending || updateTenant.isPending}
            onClick={form.handleSubmit(async (values) => {
              if (mode === 'edit') {
                if (!entityId) throw new Error('tenant id is required for update')
                await updateTenant.mutateAsync({ id: entityId, body: values })
              } else {
                await createTenant.mutateAsync({
                  ...values,
                  usersCount: 0,
                  createdAt: new Date().toISOString(),
                })
              }
              close()
            })}
          >
            Save
          </Button>
        }
      >
        {mode === 'edit' && isLoadingTenant ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading tenant…</p>
        ) : (
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
        )}
      </Modal>
    </div>
  )
}
