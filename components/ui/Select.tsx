import { cn } from '@/lib/cn'
import type { SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ className, label, error, options, id, ...props }: Props) {
  const selectId = id ?? props.name
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={selectId}>
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        id={selectId}
        className={cn(
          'rounded-md border border-[var(--color-divider)] bg-[var(--color-surface)] px-3 py-2 outline-none',
          'focus:border-[var(--color-primary)]',
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
    </label>
  )
}
