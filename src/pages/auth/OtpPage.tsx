import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'

const schema = z.object({
  code: z
    .string()
    .min(4, 'Enter the code from your email')
    .max(12, 'Code is too long')
    .regex(/^\d+$/, 'Code must be numeric'),
})

type Form = z.infer<typeof schema>

export function OtpPage() {
  const pendingEmail = useAuthStore((s) => s.pendingEmail)
  const otpPurpose = useAuthStore((s) => s.otpPurpose)
  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const clearPendingOtp = useAuthStore((s) => s.clearPendingOtp)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  if (!pendingEmail) return <Navigate to="/login" replace />

  const subtitle =
    otpPurpose === 'login'
      ? `Enter the one-time code sent to ${pendingEmail}.`
      : `Two-factor check for ${pendingEmail}.`

  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      await verifyOtp(values.code)
      navigate('/app')
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
        <Input
          label="One-time code"
          inputMode="numeric"
          autoComplete="one-time-code"
          error={errors.code?.message}
          {...register('code')}
        />
        {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Verifying…' : 'Verify'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link
          className="text-[var(--color-primary)]"
          to="/login"
          onClick={() => clearPendingOtp()}
        >
          Back
        </Link>
      </p>
    </div>
  )
}
