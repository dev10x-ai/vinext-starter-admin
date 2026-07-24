'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

const schema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type Form = z.infer<typeof schema>

export function ChangePasswordPage() {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    if (!user) {
      router.push('/login')
      return
    }
    setError('')
    try {
      await api.post('/auth/change-password', {
        email: user.email,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      setOk('Password updated')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    }
  })

  return (
    <div>
      <h1 className="text-xl font-semibold">Change password</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Input label="Current password" type="password" error={errors.currentPassword?.message} {...register('currentPassword')} />
        <Input label="New password" type="password" error={errors.newPassword?.message} {...register('newPassword')} />
        <Input label="Confirm new password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
        {ok ? <p className="text-sm text-[var(--color-success)]">{ok}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Update password
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link className="text-[var(--color-primary)]" href={user ? '/app/profile' : '/login'}>
          Back
        </Link>
      </p>
    </div>
  )
}