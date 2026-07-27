---
sidebar_position: 2
title: Forms
---

# Forms

Auth and CRUD screens in ACP Admin use **React Hook Form** + **Zod** (`zodResolver`). Field UI comes from thin wrappers under `components/ui/` (also re-exported from `components/ui/index.ts`).

**Showcase:** `/app/design-system/forms` (sidebar → **Design System → Forms**)

## Stack

| Piece | Package / path |
|-------|----------------|
| Form state | `react-hook-form` (`useForm`, `register`, `handleSubmit`, `watch`, `setValue`, `Controller`) |
| Schema | `zod` + `@hookform/resolvers/zod` |
| Text / select | `@/components/ui/Input`, `@/components/ui/Select` |
| Boolean / multi | `@/components/ui/Checkbox`, `@/components/ui/Switch` |
| Long text / date / file | `@/components/ui/Textarea`, `@/components/ui/DatePicker`, `@/components/ui/FileUpload` |
| OTP digits | `@/components/ui/InputOTP` |
| Actions | `@/components/ui/Button` |
| Dialogs | `@/components/ui/Modal` |
| Sections | `@/components/ui/Card`, `@/components/ui/PageHeader` |

Server reads/writes use **TanStack Query** hooks under `queries/`. Session and UI prefs live in **Zustand**.

## Control inventory

| Control | Status | Typical usage |
|---------|--------|---------------|
| `Input` | **Exported** | Text, email, password, numbers via native `type` / `inputMode` |
| `Select` | **Exported** | Status, role, plan, provider dropdowns |
| `Checkbox` | **Exported** | Menu enabled, AI/integrations toggles, role permissions |
| `Switch` | **Exported** | Profile 2FA, logs export toggle |
| `Textarea` | **Exported** | Role description |
| `DatePicker` | **Exported** | Logs purge-before date |
| `FileUpload` | **Exported** | Logs import filter config (filename stored in mock) |
| `InputOTP` | **Exported** | OTP verify page (`Controller` + 6 digits) |
| `Button` | **Exported** | Submit / secondary / danger actions |
| `Modal` | **Exported** | Create/edit forms (Users, Tenants) |

See [Form fields](./form-fields) for props and copy-paste examples, and [Form patterns](./form-patterns) for full screen recipes.

## Conventions

1. Define a Zod schema, then `type Form = z.infer<typeof schema>`.
2. Wire `useForm` with `resolver: zodResolver(schema)` and `defaultValues`.
3. Pass field errors into field components via the `error` prop from `form.formState.errors`.
4. Prefer `form.handleSubmit` for async mutations.
5. For booleans, use `Checkbox` / `Switch` with `register('enabled')` (Zod `z.boolean()`).
6. For permission arrays, control `Checkbox` with `watch` + `setValue` (see Roles).
7. For OTP digit groups, prefer `Controller` + `InputOTP` (`value` / `onChange` string API).

## Minimal example

```tsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type Form = z.infer<typeof schema>

export function LoginSnippet() {
  const form = useForm<Form>({ resolver: zodResolver(schema) })

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        // await login(values)
      })}
    >
      <Input
        label="Email"
        type="email"
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <Input
        label="Password"
        type="password"
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Sign in
      </Button>
    </form>
  )
}
```

## Screens that use this pattern

Login (password + OTP request), OTP verify (`InputOTP`), Signup, Forgot password, Change password, Users/Tenants modals, Roles (`Checkbox` + `Textarea`), Menu editor, Profile (`Switch` for 2FA), Platform settings panels (`Checkbox`, `Switch`, `DatePicker`, `FileUpload`).

## Next steps

1. [Form fields](./form-fields) — props and copy-paste for every control  
2. [Form patterns](./form-patterns) — OTP, checkboxes, password strength, modal CRUD  
3. [Typography](./typography) — `Prose` for semantic HTML content  
4. Then [Lists & tables](./lists-and-tables) → [DataTable](./data-table) for index pages that host these forms
