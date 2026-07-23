import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/cn'

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

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const requestOtpLogin = useAuthStore((s) => s.requestOtpLogin)
  const navigate = useNavigate()
  const [mode, setMode] = useState<LoginMode>('password')
  const [error, setError] = useState('')

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })
  const otpForm = useForm<OtpRequestForm>({ resolver: zodResolver(otpRequestSchema) })

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    setError('')
    try {
      const result = await login(values.email, values.password)
      navigate(result === 'otp' ? '/otp' : '/app')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed')
    }
  })

  const onOtpRequestSubmit = otpForm.handleSubmit(async (values) => {
    setError('')
    try {
      await requestOtpLogin(values.email)
      navigate('/otp')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send OTP')
    }
  })

  return (
    <div>
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Password: admin@acp.local / Admin123! · OTP login uses code 123456
      </p>

      <div className="mt-4 grid grid-cols-2 gap-1 rounded-md bg-[var(--color-accent)] p-1">
        <button
          type="button"
          className={cn(
            'rounded-md px-3 py-2 text-sm font-medium transition-colors',
            mode === 'password'
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
          )}
          onClick={() => {
            setMode('password')
            setError('')
          }}
        >
          Password
        </button>
        <button
          type="button"
          className={cn(
            'rounded-md px-3 py-2 text-sm font-medium transition-colors',
            mode === 'otp'
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
          )}
          onClick={() => {
            setMode('otp')
            setError('')
          }}
        >
          Login with OTP
        </button>
      </div>

      {mode === 'password' ? (
        <form className="mt-6 space-y-4" onSubmit={onPasswordSubmit}>
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
          {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={passwordForm.formState.isSubmitting}>
            {passwordForm.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onOtpRequestSubmit}>
          <Input
            label="Email"
            type="email"
            error={otpForm.formState.errors.email?.message}
            {...otpForm.register('email')}
          />
          <p className="text-sm text-[var(--color-text-muted)]">
            We will email a one-time code. In this mock, use <strong>123456</strong>.
          </p>
          {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={otpForm.formState.isSubmitting}>
            {otpForm.formState.isSubmitting ? 'Sending code…' : 'Send OTP code'}
          </Button>
        </form>
      )}

      <div className="mt-4 flex justify-between text-sm">
        <Link className="text-[var(--color-primary)]" to="/forgot-password">
          Forgot password?
        </Link>
        <Link className="text-[var(--color-primary)]" to="/signup">
          Create account
        </Link>
      </div>
    </div>
  )
}
