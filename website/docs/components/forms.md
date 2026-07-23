---
sidebar_position: 2
title: Forms
---

# Forms

Auth and CRUD screens in ACP Admin use **React Hook Form** + **Zod** (`zodResolver`). Field UI comes from thin wrappers under `src/components/ui/`.

## Stack

| Piece | Package / path |
|-------|----------------|
| Form state | `react-hook-form` (`useForm`, `register`, `handleSubmit`, `watch`, `setValue`) |
| Schema | `zod` + `@hookform/resolvers/zod` |
| Text / select | `@/components/ui/Input`, `@/components/ui/Select` |
| Actions | `@/components/ui/Button` |
| Dialogs | `@/components/ui/Modal` |
| Sections | `@/components/ui/Card`, `@/components/ui/PageHeader` |

Server reads/writes use **TanStack Query** hooks under `src/queries/`. Session and UI prefs live in **Zustand**.

## What exists vs planned

| Control | Status | How the app uses it today |
|---------|--------|---------------------------|
| `Input` | **Exported** | Text, email, password, OTP code, numbers via native `type` / `inputMode` |
| `Select` | **Exported** | Status, role, plan, provider dropdowns |
| `Button` | **Exported** | Submit / secondary / danger actions |
| `Modal` | **Exported** | Create/edit forms (Users, Tenants) |
| Checkbox | **Native only** | `<input type="checkbox">` + RHF `register` or controlled `setValue` |
| Switch / Toggle | **Not exported** | 2FA uses `Button` + `Badge`, not a switch primitive |
| Textarea | **Not exported** | Use native `<textarea>` if needed |
| Date / File | **Not exported** | Not used in current screens |
| Dedicated OTP digits | **Not exported** | Single `Input` with `inputMode="numeric"` |

See [Form fields](./form-fields) for props and copy-paste examples, and [Form patterns](./form-patterns) for full screen recipes.

## Conventions

1. Define a Zod schema, then `type Form = z.infer<typeof schema>`.
2. Wire `useForm` with `resolver: zodResolver(schema)` and `defaultValues`.
3. Pass field errors into `Input` / `Select` via the `error` prop from `form.formState.errors`.
4. Prefer `form.handleSubmit` for async mutations.
5. For booleans, use native checkbox + `register('enabled')` (Zod `z.boolean()`).
6. For permission arrays, control checkboxes with `watch` + `setValue` (see Roles).

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

Login (password + OTP request), OTP verify, Signup, Forgot password, Change password, Users/Tenants modals, Roles, Menu editor, Profile, Platform settings panels.

## Next

- [Form fields](./form-fields) — `Input`, `Select`, `Button`, layout helpers
- [Form patterns](./form-patterns) — OTP, checkboxes, password strength, modal CRUD
- [DataTable](./data-table) — Filament-inspired list tooling
