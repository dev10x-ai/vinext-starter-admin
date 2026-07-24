'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ClientRedirect } from '@/components/navigation/ClientRedirect'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputOTP } from '@/components/ui/InputOTP'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'

const OTP_LENGTH = 6

const schema = z.object({
  code: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code from your email`)
    .regex(/^\d+$/, 'Code must be numeric'),
})

type Form = z.infer<typeof schema>

export function OtpPage() {
  const pendingEmail = useAuthStore((s) => s.pendingEmail)
  const otpPurpose = useAuthStore((s) => s.otpPurpose)
  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const clearPendingOtp = useAuthStore((s) => s.clearPendingOtp)
  const [error, setError] = useState('')
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  })

  if (!pendingEmail) return <ClientRedirect href="/login" />

  const subtitle =
    otpPurpose === 'login'
      ? `Enter the one-time code sent to ${pendingEmail}.`
      : `Two-factor check for ${pendingEmail}.`

  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      await verifyOtp(values.code)
      router.push('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code')
    }
  })

  return (
    <div>
      <h1 className="text-xl font-semibold">Enter OTP</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        {subtitle} Demo code: <strong>123456</strong>
      </p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <InputOTP
              label="One-time code"
              length={OTP_LENGTH}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              autoFocus
              error={errors.code?.message}
              hint={`${OTP_LENGTH} digits`}
            />
          )}
        />
        {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Verifying…' : 'Verify'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link
          className="text-[var(--color-primary)]"
          href="/login"
          onClick={() => clearPendingOtp()}
        >
          Back
        </Link>
      </p>
    </div>
  )
}