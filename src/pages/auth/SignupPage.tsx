import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'

const PASSWORD_RULES = [
  { key: 'minLength', test: (pw: string) => pw.length >= 8, label: 'Min. 8 characters' },
  { key: 'mixedCase', test: (pw: string) => /(?=.*[a-z])(?=.*[A-Z])/.test(pw), label: 'Upper & lowercase' },
  { key: 'number', test: (pw: string) => /\d/.test(pw), label: 'At least 1 number' },
  { key: 'special', test: (pw: string) => /[^a-zA-Z0-9\s]/.test(pw), label: 'At least 1 symbol' },
] as const

const schema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    organizationName: z.string().min(2, 'Organization is required'),
    email: z.email('Enter a valid email'),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type Form = z.infer<typeof schema>

export function SignupPage() {
  const signup = useAuthStore((s) => s.signup)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })
  const password = watch('password') ?? ''
  const strength = useMemo(() => {
    const passed = PASSWORD_RULES.filter((r) => r.test(password)).length
    return { passed, percent: (passed / PASSWORD_RULES.length) * 100 }
  }, [password])

  const onSubmit = handleSubmit(async (values) => {
    setError('')
    if (strength.passed < PASSWORD_RULES.length) {
      setError('Password must meet all requirements')
      return
    }
    try {
      await signup(values)
      navigate('/app')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Signup failed')
    }
  })

  return (
    <div>
      <h1 className="text-xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">Macro-style signup for ACP tenants</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Input label="Full name" error={errors.name?.message} {...register('name')} />
        <Input label="Organization" error={errors.organizationName?.message} {...register('organizationName')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
        <div className="h-1.5 overflow-hidden rounded bg-[var(--color-accent)]">
          <div
            className="h-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${strength.percent}%` }}
          />
        </div>
        <ul className="space-y-1 text-xs">
          {PASSWORD_RULES.map((r) => {
            const ok = r.test(password)
            return (
              <li key={r.key} className={`flex items-center gap-1.5 ${ok ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}>
                {ok ? <Check size={12} /> : <X size={12} />}
                {r.label}
              </li>
            )
          })}
        </ul>
        <Input label="Confirm password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Sign up'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link className="text-[var(--color-primary)]" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}
