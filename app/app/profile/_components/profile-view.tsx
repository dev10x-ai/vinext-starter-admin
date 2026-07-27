'use client'

import Link from 'next/link'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Switch } from '@/components/ui/Switch'
import { useAuthStore } from '@/store/auth'
import { useUpdateUserMutation } from '@/queries'

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
})
type Form = z.infer<typeof schema>

export function ProfileView() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const updateUser = useUpdateUserMutation()
  const [message, setMessage] = useState('')
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    values: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  if (!user) return null

  return (
    <div>
      <PageHeader title="My profile" description="Edit profile and manage 2FA." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit(async (values) => {
              const updated = await updateUser.mutateAsync({ id: user.id, body: values })
              setUser({ ...user, ...updated })
              setMessage('Profile saved')
            })}
          >
            <Input label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
            <Input label="Email" error={form.formState.errors.email?.message} {...form.register('email')} />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={updateUser.isPending || form.formState.isSubmitting}>
                Save profile
              </Button>
              <Link href="/change-password">
                <Button type="button" variant="secondary">
                  Change password
                </Button>
              </Link>
            </div>
            {message ? <p className="text-sm text-[var(--color-success)]">{message}</p> : null}
          </form>
        </Card>
        <Card>
          <h2 className="font-semibold">Two-factor authentication</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            When enabled, password login requires OTP <code>123456</code> (mocked). OTP-only login still works
            without enabling 2FA.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Badge tone={user.twoFactorEnabled ? 'success' : 'neutral'}>
              {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
            <Switch
              label={user.twoFactorEnabled ? '2FA on' : '2FA off'}
              checked={user.twoFactorEnabled}
              disabled={updateUser.isPending}
              onChange={async (event) => {
                const enabled = event.target.checked
                const updated = await updateUser.mutateAsync({
                  id: user.id,
                  body: { twoFactorEnabled: enabled },
                })
                setUser({ ...user, ...updated })
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}