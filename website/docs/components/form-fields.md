---
sidebar_position: 3
title: Form fields
---

# Form fields

Primitives live in `src/components/ui/`. They are thin styled wrappers around native HTML controls — no separate RHF field components (`FormField`, `Controller` wrappers) are exported.

## Input

**Path:** `src/components/ui/Input.tsx`

Extends native `<input>` attributes with label / error / hint.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text above the field |
| `error` | `string` | — | Error message (danger color); hides `hint` when set |
| `hint` | `string` | — | Helper text when there is no error |
| `id` | `string` | `name` | Linked to the label via `htmlFor` |
| `…rest` | `InputHTMLAttributes` | — | `type`, `placeholder`, `disabled`, `inputMode`, etc. |

### Copy-paste: text / email / password

```tsx
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Min. 8 characters'),
})

type Form = z.infer<typeof schema>

export function ProfileFields() {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(console.log)}>
      <Input
        label="Name"
        error={form.formState.errors.name?.message}
        {...form.register('name')}
      />
      <Input
        label="Email"
        type="email"
        hint="Used for login and notifications"
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />
    </form>
  )
}
```

### Copy-paste: OTP code (no dedicated OTP component)

There is **no** multi-digit OTP widget. Use a single `Input` (see `OtpPage`):

```tsx
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  code: z
    .string()
    .min(4, 'Enter the code from your email')
    .max(12, 'Code is too long')
    .regex(/^\d+$/, 'Code must be numeric'),
})

type Form = z.infer<typeof schema>

export function OtpFieldExample() {
  const form = useForm<Form>({ resolver: zodResolver(schema) })

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(console.log)}>
      <Input
        label="One-time code"
        inputMode="numeric"
        autoComplete="one-time-code"
        error={form.formState.errors.code?.message}
        {...form.register('code')}
      />
      <Button type="submit">Verify</Button>
    </form>
  )
}
```

### Copy-paste: number field

```tsx
<Input
  label="Retention days"
  type="number"
  error={form.formState.errors.retentionDays?.message}
  {...form.register('retentionDays', { valueAsNumber: true })}
/>
```

---

## Select

**Path:** `src/components/ui/Select.tsx`

Native `<select>` with options array.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text |
| `error` | `string` | — | Error message |
| `options` | `Option[]` | **required** | List of value/label objects (see example below) |
| `id` | `string` | `name` | Label association |
| `…rest` | `SelectHTMLAttributes` | — | `value`, `onChange`, `disabled`, etc. |

### Copy-paste: with RHF `register`

```tsx
import { Select } from '@/components/ui/Select'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  status: z.enum(['active', 'inactive']),
  role: z.string().min(1),
})

type Form = z.infer<typeof schema>

export function SelectExample() {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', role: 'operator' },
  })

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(console.log)}>
      <Select
        label="Role"
        options={[
          { value: 'owner', label: 'Owner' },
          { value: 'operator', label: 'Operator' },
          { value: 'viewer', label: 'Viewer' },
        ]}
        error={form.formState.errors.role?.message}
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
  )
}
```

### Copy-paste: controlled (`watch` + `setValue`)

Used in settings when the select must stay in sync after `form.reset`:

```tsx
<Select
  label="Provider"
  value={form.watch('provider')}
  onChange={(e) => form.setValue('provider', e.target.value, { shouldDirty: true })}
  options={[
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'azure', label: 'Azure OpenAI' },
  ]}
/>
```

---

## Button

**Path:** `src/components/ui/Button.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding / font size |
| `type` | button types | `'button'` | Use `type="submit"` in forms |
| `…rest` | `ButtonHTMLAttributes` | — | `disabled`, `onClick`, etc. |

```tsx
import { Button } from '@/components/ui/Button'

<>
  <Button type="submit">Save</Button>
  <Button type="button" variant="secondary">Cancel</Button>
  <Button type="button" variant="danger" size="sm">Delete</Button>
  <Button type="button" variant="ghost" size="sm">Edit</Button>
</>
```

---

## Layout helpers used with forms

### Modal

**Path:** `src/components/ui/Modal.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Visibility |
| `title` | `string` | Header title |
| `onClose` | `() => void` | Close handler |
| `children` | `ReactNode` | Body (usually a `<form>`) |
| `footer` | `ReactNode` | Optional action row |

```tsx
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

<Modal
  open={open}
  title="New user"
  onClose={() => setOpen(false)}
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={form.handleSubmit(onSave)}>Save</Button>
    </>
  }
>
  <form className="space-y-3">
    <Input label="Name" {...form.register('name')} />
  </form>
</Modal>
```

### Card / PageHeader / Badge

```tsx
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'

<PageHeader
  title="My profile"
  description="Edit profile and manage 2FA."
  actions={<Button>Secondary action</Button>}
/>

<Card className="space-y-3">
  {/* form fields */}
</Card>

<Badge tone="success">active</Badge>
{/* tone: 'neutral' | 'success' | 'warning' | 'danger' */}
```

---

## Native checkbox (no `Checkbox` export)

Settings and Menu use a labeled native checkbox with RHF:

```tsx
<label className="flex items-center gap-2 text-sm">
  <input type="checkbox" {...form.register('enabled')} />
  Enabled
</label>
```

Schema: `enabled: z.boolean()`.

For multi-select permission lists, see [Form patterns](./form-patterns#checkbox-array-roles).

## Not available yet

These are **planned / not in the design system** — do not import them:

- `Checkbox`, `Switch`, `Textarea`, `DatePicker`, `FileUpload`, `InputOTP`
- RHF wrappers like `<FormField name="…">`

Use native HTML + the patterns above until wrappers exist.
