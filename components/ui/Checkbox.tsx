import { useId } from 'react'
import { cn } from '@/lib/cn'
import type { InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: string
  error?: string
  hint?: string
  size?: 'sm' | 'md'
}

export function Checkbox({
  className,
  label,
  error,
  hint,
  id,
  size = 'md',
  disabled,
  ...props
}: Props) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId

  return (
    <div className="flex flex-col gap-1 text-sm">
      <label
        className={cn(
          'inline-flex items-start gap-2',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        )}
        htmlFor={inputId}
      >
        <input
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'mt-0.5 shrink-0 rounded border border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-primary)] outline-none transition-colors',
            'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1',
            'accent-[var(--color-primary)]',
            size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
            error && 'border-[var(--color-danger)]',
            className,
          )}
          {...props}
        />
        {label ? <span className="font-medium text-[var(--color-text)]">{label}</span> : null}
      </label>
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-[var(--color-text-muted)]">{hint}</span> : null}
    </div>
  )
}
