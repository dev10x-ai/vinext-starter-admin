---
sidebar_position: 4
title: Form patterns
---

# Form patterns

Realistic recipes copied from ACP Admin screens. All examples assume path aliases (`@/…`) as in the Vite app.

## Login (password + OTP request)

Two schemas / two `useForm` instances, toggled by UI mode (`LoginPage`):

```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const passwordSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const otpRequestSchema = z.object({
  email: z.email('Enter a valid email'),
})

type PasswordForm = z.infer<typeof passwordSchema>
type OtpRequestForm = z.infer<typeof otpRequestSchema>
type LoginMode = 'password' | 'otp'

export function LoginPattern() {
  const [mode, setMode] = useState<LoginMode>('password')
  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })
  const otpForm = useForm<OtpRequestForm>({ resolver: zodResolver(otpRequestSchema) })

  if (mode === 'otp') {
    return (
      <form
        className="space-y-4"
        onSubmit={otpForm.handleSubmit(async (values) => {
          // await requestOtpLogin(values.email)
        })}
      >
        <button type="button" onClick={() => setMode('password')}>
          Use password
        </button>
        <Input
          label="Email"
          type="email"
          error={otpForm.formState.errors.email?.message}
          {...otpForm.register('email')}
        />
        <Button type="submit" disabled={otpForm.formState.isSubmitting}>
          Send OTP code
        </Button>
      </form>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={passwordForm.handleSubmit(async (values) => {
        // const result = await login(values.email, values.password)
        // navigate(result === 'otp' ? '/otp' : '/app')
      })}
    >
      <button type="button" onClick={() => setMode('otp')}>
        Login with OTP
      </button>
      <Input
        label="Email"
        type="email"
        error={passwordForm.formState.errors.email?.message}
        {...passwordForm.register('email')}
      />
      <Input
        label="Password"
        type="password"
        error={passwordForm.formState.errors.password?.message}
        {...passwordForm.register('password')}
      />
      <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
        Sign in
      </Button>
    </form>
  )
}
```

## Password strength checklist (Signup)

Macro-style rules with a live checklist — **not** a reusable component; copy the pattern from `SignupPage`:

```tsx
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const PASSWORD_RULES = [
  { key: 'minLength', test: (pw: string) => pw.length >= 8, label: 'Min. 8 characters' },
  { key: 'mixedCase', test: (pw: string) => /(?=.*[a-z])(?=.*[A-Z])/.test(pw), label: 'Upper & lowercase' },
  { key: 'number', test: (pw: string) => /\d/.test(pw), label: 'At least 1 number' },
  { key: 'special', test: (pw: string) => /[^a-zA-Z0-9\s]/.test(pw), label: 'At least 1 symbol' },
] as const

const schema = z
  .object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type Form = z.infer<typeof schema>

export function SignupPasswordPattern() {
  const form = useForm<Form>({ resolver: zodResolver(schema) })
  const password = form.watch('password') ?? ''
  const strength = useMemo(() => {
    const passed = PASSWORD_RULES.filter((r) => r.test(password)).length
    return { passed, percent: (passed / PASSWORD_RULES.length) * 100 }
  }, [password])

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        if (strength.passed < PASSWORD_RULES.length) return
        // await signup(values)
      })}
    >
      <Input label="Full name" error={form.formState.errors.name?.message} {...form.register('name')} />
      <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register('email')} />
      <Input label="Password" type="password" {...form.register('password')} />
      <div className="h-1.5 overflow-hidden rounded bg-[var(--color-accent)]">
        <div className="h-full bg-[var(--color-primary)] transition-all" style={{ width: `${strength.percent}%` }} />
      </div>
      <ul className="space-y-1 text-xs">
        {PASSWORD_RULES.map((r) => {
          const ok = r.test(password)
          return (
            <li
              key={r.key}
              className={ok ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}
            >
              {ok ? <Check size={12} /> : <X size={12} />} {r.label}
            </li>
          )
        })}
      </ul>
      <Input
        label="Confirm password"
        type="password"
        error={form.formState.errors.confirmPassword?.message}
        {...form.register('confirmPassword')}
      />
      <Button type="submit">Sign up</Button>
    </form>
  )
}
```

## Boolean checkbox (Settings)

```tsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const schema = z.object({
  model: z.string().min(1),
  enabled: z.boolean(),
})

type Form = z.infer<typeof schema>

export function BooleanCheckboxPattern() {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { model: '', enabled: false },
  })

  return (
    <Card className="space-y-3">
      <form className="space-y-3" onSubmit={form.handleSubmit(console.log)}>
        <Input label="Model" {...form.register('model')} />
        <Checkbox label="Enabled" {...form.register('enabled')} />
        <Button type="submit">Save</Button>
      </form>
    </Card>
  )
}
```

## Checkbox array (Roles)

Permissions are a `string[]`. Checkboxes are **controlled** (not `register` per box):

```tsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  name: z.string().min(2, 'Role name is required'),
  permissions: z.array(z.string()),
})

type Form = z.infer<typeof schema>

const ALL_PERMS = [
  { key: 'users.read', label: 'Read users' },
  { key: 'users.write', label: 'Write users' },
]

export function PermissionCheckboxesPattern() {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', permissions: [] },
  })
  const watched = form.watch('permissions')

  const togglePerm = (key: string) => {
    const current = form.getValues('permissions')
    const next = current.includes(key) ? current.filter((p) => p !== key) : [...current, key]
    form.setValue('permissions', next, { shouldDirty: true })
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(console.log)}>
      <Input label="Role name" error={form.formState.errors.name?.message} {...form.register('name')} />
      {ALL_PERMS.map((p) => (
        <Checkbox
          key={p.key}
          label={p.label}
          checked={watched.includes(p.key)}
          onChange={() => togglePerm(p.key)}
        />
      ))}
      <Button type="submit">Save role</Button>
    </form>
  )
}
```

## Modal CRUD (Users)

Create/edit in a `Modal`, table outside. Condensed from `UsersPage`:

```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  role: z.string().min(1),
  status: z.enum(['active', 'inactive']),
})

type Form = z.infer<typeof schema>

export function ModalCrudPattern() {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', role: 'operator' },
  })

  return (
    <div>
      <PageHeader
        title="Users"
        actions={
          <Button
            onClick={() => {
              setEditingId(null)
              form.reset({ name: '', email: '', role: 'operator', status: 'active' })
              setOpen(true)
            }}
          >
            New user
          </Button>
        }
      />

      <Modal
        open={open}
        title={editingId ? 'Edit user' : 'New user'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(async (values) => {
                // if (editingId) await update… else await create…
                setOpen(false)
              })}
            >
              Save
            </Button>
          </>
        }
      >
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
        </form>
      </Modal>
    </div>
  )
}
```

## Profile with `values` sync

When editing server data that loads into the store, prefer RHF `values` (see `ProfilePage`):

```tsx
const form = useForm<Form>({
  resolver: zodResolver(schema),
  values: { name: user?.name ?? '', email: user?.email ?? '' },
})
```

## 2FA with Switch

Profile pairs `Badge` status with a `Switch`:

```tsx
import { Badge } from '@/components/ui/Badge'
import { Switch } from '@/components/ui/Switch'

<div className="flex items-center gap-3">
  <Badge tone={enabled ? 'success' : 'neutral'}>
    {enabled ? 'Enabled' : 'Disabled'}
  </Badge>
  <Switch
    label={enabled ? '2FA on' : '2FA off'}
    checked={enabled}
    onChange={(e) => void toggle(e.target.checked)}
  />
</div>
```

## Next steps

Forms usually sit beside a list page. Continue in reading order:

1. [Typography](./typography) — `Prose` for semantic HTML content  
2. [Lists & tables](./lists-and-tables) — Filament-inspired index mental model  
3. [DataTable](./data-table) — search, filters, columns, full list-page skeleton  

Related: [Form fields](./form-fields) for props tables.
