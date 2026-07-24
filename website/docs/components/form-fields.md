---
sidebar_position: 3
title: Form fields
---

# Form fields

Primitives live in `src/components/ui/` and are re-exported from `src/components/ui/index.ts`. They are thin styled wrappers around native HTML controls — no separate RHF field components (`FormField` wrappers) are exported. All fields use theme CSS variables (`--color-*`) so Default / Ruby / Emerald + light/dark stay consistent.

**Showcase:** `/app/design-system/forms` (sidebar → **Design System → Forms**) — live Checkbox, Switch, Textarea, DatePicker, FileUpload, InputOTP.

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
| `options` | `Option[]` | **required** | List of value/label objects |
| `id` | `string` | `name` | Label association |
| `…rest` | `SelectHTMLAttributes` | — | `value`, `onChange`, `disabled`, etc. |

```tsx
import { Select } from '@/components/ui/Select'

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
```

---

## Checkbox

**Path:** `src/components/ui/Checkbox.tsx`

Labeled checkbox (control beside label). Works with `register` or controlled `checked` / `onChange`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Text beside the control |
| `error` | `string` | — | Error under the field |
| `hint` | `string` | — | Helper when no error |
| `size` | `'sm' \| 'md'` | `'md'` | Control size |
| `…rest` | checkbox input attrs | — | `name`, `disabled`, `checked`, etc. |

```tsx
import { Checkbox } from '@/components/ui/Checkbox'

<Checkbox label="Enabled" {...form.register('enabled')} />

{/* Controlled (Roles permissions) */}
<Checkbox
  label="Read users"
  checked={watched.includes('users.read')}
  onChange={() => togglePerm('users.read')}
/>
```

---

## Switch

**Path:** `src/components/ui/Switch.tsx` (+ `Switch.module.css`)

Accessible toggle (`role="switch"`) built on a native checkbox so `register` still works.

```tsx
import { Switch } from '@/components/ui/Switch'

<Switch label="Allow log export" {...form.register('exportEnabled')} />

{/* Immediate toggle (Profile 2FA) */}
<Switch
  label="2FA on"
  checked={user.twoFactorEnabled}
  onChange={(e) => void toggleTwoFactor(e.target.checked)}
/>
```

---

## Textarea

**Path:** `src/components/ui/Textarea.tsx`

```tsx
import { Textarea } from '@/components/ui/Textarea'

<Textarea
  label="Description"
  hint="Shown when assigning this role"
  error={form.formState.errors.description?.message}
  {...form.register('description')}
/>
```

---

## DatePicker

**Path:** `src/components/ui/DatePicker.tsx`

Native `type="date"` with the same label / error / hint pattern as `Input`.

```tsx
import { DatePicker } from '@/components/ui/DatePicker'

<DatePicker
  label="Purge logs before"
  hint="Optional cutoff for retention jobs"
  {...form.register('purgeBefore')}
/>
```

---

## FileUpload

**Path:** `src/components/ui/FileUpload.tsx`

Styled file input with selected-filename summary. For RHF, set a string filename (or `File`) via `setValue` / `Controller`.

```tsx
import { FileUpload } from '@/components/ui/FileUpload'

<FileUpload
  label="Import filter config"
  accept=".json,.txt,application/json"
  hint="Mocked — only the filename is stored"
  onChange={(e) => {
    const file = e.target.files?.[0]
    form.setValue('importConfigName', file?.name ?? '', { shouldDirty: true })
  }}
/>
```

---

## InputOTP

**Path:** `src/components/ui/InputOTP.tsx`

Multi-digit OTP group. **Controller-friendly**: `value` / `onChange(string)`. Used on `OtpPage`.

```tsx
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputOTP } from '@/components/ui/InputOTP'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  code: z.string().length(6).regex(/^\d+$/, 'Code must be numeric'),
})

type Form = z.infer<typeof schema>

export function OtpFieldExample() {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  })

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(console.log)}>
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <InputOTP
            label="One-time code"
            length={6}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      <Button type="submit">Verify</Button>
    </form>
  )
}
```

---

## Button

**Path:** `src/components/ui/Button.tsx`

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

```tsx
import { Button } from '@/components/ui/Button'

<>
  <Button type="submit">Save</Button>
  <Button type="button" variant="secondary">Cancel</Button>
  <Button type="button" variant="danger" size="sm">Delete</Button>
</>
```

---

## Layout helpers used with forms

### Modal

**Path:** `src/components/ui/Modal.tsx`

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
import { Card, PageHeader, Badge } from '@/components/ui'

<PageHeader title="My profile" description="Edit profile and manage 2FA." />
<Card className="space-y-3">{/* fields */}</Card>
<Badge tone="success">active</Badge>
```

## Not provided as DS wrappers

RHF wrappers like `<FormField name="…">` are still not exported — compose with `register` / `Controller` as above.

## Next steps

- [Form patterns](./form-patterns) — full-screen recipes  
- [Typography](./typography) — `Prose` for long-form HTML  
- Back to [Forms](./forms) for stack conventions
