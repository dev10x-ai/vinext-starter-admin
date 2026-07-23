import { useEffect, useMemo, useState } from 'react'
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
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUserQuery,
  useUsersQuery,
} from '@/queries'
import { toast } from '@/store/toast'
import type { User } from '@/types'

const USERS_LIST_PATH = '/app/access/users'

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  role: z.string().min(1),
  status: z.enum(['active', 'inactive']),
  tenantId: z.string().min(1),
  password: z.string().min(8).optional(),
})

type Form = z.infer<typeof schema>

const CREATE_DEFAULTS: Form = {
  name: '',
  email: '',
  role: 'operator',
  status: 'active',
  tenantId: '1',
  password: 'Welcome1!',
}

export function UsersPage() {
  const { data: users = [], isLoading } = useUsersQuery()
  const createUser = useCreateUserMutation()
  const updateUser = useUpdateUserMutation()
  const deleteUser = useDeleteUserMutation()
  const [statusFilter, setStatusFilter] = useState('all')
  const { mode, entityId, open, openCreate, openEdit, close } = useModalRoute(USERS_LIST_PATH)
  const {
    data: editingUser,
    isLoading: isLoadingUser,
    isError: isUserError,
    error: userError,
  } = useUserQuery(mode === 'edit' ? entityId : null)

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', role: 'operator', tenantId: '1' },
  })

  useEffect(() => {
    if (mode === 'create') {
      form.reset(CREATE_DEFAULTS)
      return
    }
    if (mode === 'edit' && editingUser) {
      form.reset({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status === 'inactive' ? 'inactive' : 'active',
        tenantId: editingUser.tenantId,
      })
    }
  }, [mode, editingUser, form])

  useEffect(() => {
    if (mode !== 'edit' || !isUserError) return
    toast.error(userError instanceof Error ? userError.message : 'User not found')
    close()
  }, [mode, isUserError, userError, close])

  const rows = useMemo(
    () => (statusFilter === 'all' ? users : users.filter((u) => u.status === statusFilter)),
    [users, statusFilter],
  )

  const columns: Column<User>[] = [
    { key: 'name', label: 'Name', sortable: true, render: (u) => u.name },
    { key: 'email', label: 'Email', sortable: true, render: (u) => u.email },
    { key: 'role', label: 'Role', sortable: true, render: (u) => u.role },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (u) => <Badge tone={u.status === 'active' ? 'success' : 'warning'}>{u.status}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (u) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => openEdit(u.id)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={deleteUser.isPending}
            onClick={() => void deleteUser.mutateAsync(u.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const modalTitle = mode === 'edit' ? 'Edit user' : 'New user'
  const canSubmit =
    mode === 'create' || (mode === 'edit' && Boolean(editingUser) && !isLoadingUser)

  return (
    <div>
      <PageHeader
        title="Users"
        description="CRUD with Filament-inspired table tooling."
        actions={<Button onClick={openCreate}>New user</Button>}
      />
      {isLoading ? <p className="mb-3 text-sm text-[var(--color-text-muted)]">Loading users…</p> : null}
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
        onExport={() => {
          const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'users.json'
          a.click()
        }}
      />

      <Modal
        open={open}
        title={modalTitle}
        onClose={close}
        footer={
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button
              disabled={!canSubmit || createUser.isPending || updateUser.isPending}
              onClick={form.handleSubmit(async (values) => {
                if (mode === 'edit') {
                  if (!entityId) throw new Error('user id is required for update')
                  await updateUser.mutateAsync({ id: entityId, body: values })
                } else {
                  await createUser.mutateAsync({
                    ...values,
                    password: values.password ?? 'Welcome1!',
                    twoFactorEnabled: false,
                    createdAt: new Date().toISOString(),
                  })
                }
                close()
              })}
            >
              Save
            </Button>
          </>
        }
      >
        {mode === 'edit' && isLoadingUser ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading user…</p>
        ) : (
          <form className="space-y-3">
            <Input label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
            <Input label="Email" error={form.formState.errors.email?.message} {...form.register('email')} />
            <Select
              label="Role"
              options={[
                { value: 'owner', label: 'Owner' },
                { value: 'operator', label: 'Operator' },
                { value: 'viewer', label: 'Viewer' },
              ]}
              {...form.register('role')}
            />
            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              {...form.register('status')}
            />
            <Input label="Tenant ID" {...form.register('tenantId')} />
            {mode === 'create' ? (
              <Input label="Temp password" type="password" {...form.register('password')} />
            ) : null}
          </form>
        )}
      </Modal>
    </div>
  )
}
