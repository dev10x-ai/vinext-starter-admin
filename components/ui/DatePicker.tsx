import { cn } from '@/lib/cn'
import type { InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  error?: string
  hint?: string
}

export function DatePicker({ className, label, error, hint, id, ...props }: Props) {
  const inputId = id ?? props.name
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={inputId}>
      {label ? <span className="font-medium text-[var(--color-text)]">{label}</span> : null}
      <input
        id={inputId}
        type="date"
        className={cn(
          'rounded-md border bg-[var(--color-surface)] px-3 py-2 outline-none transition-colors',
          'border-[var(--color-divider)] focus:border-[var(--color-primary)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'min-h-11 w-full max-w-full sm:min-h-0',
          error && 'border-[var(--color-danger)]',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-[var(--color-text-muted)]">{hint}</span> : null}
    </label>
  )
}
