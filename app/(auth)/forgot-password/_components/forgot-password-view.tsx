'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

const schema = z.object({ email: z.email() })
type Form = z.infer<typeof schema>

export function ForgotPasswordView() {
  const [message, setMessage] = useState('')
  const [ready, setReady] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  useEffect(() => {
    setReady(true)
  }, [])

  const onSubmit = handleSubmit(async (values) => {
    const res = await api.post<{ message: string; demoOtp: string }>('/auth/forgot-password', values)
    setMessage(`${res.message} Demo OTP: ${res.demoOtp}`)
  })

  return (
    <div data-testid="forgot-password-form" data-ready={ready ? 'true' : 'false'}>
      <h1 className="text-xl font-semibold">Forgot password</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">We will send a mocked reset code.</p>
      <form className="mt-6 space-y-4" method="post" onSubmit={onSubmit}>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        {message ? <p className="text-sm text-[var(--color-success)]">{message}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Send reset code
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link className="text-[var(--color-primary)]" href="/login">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}