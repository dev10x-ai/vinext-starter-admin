import { cn } from '@/lib/cn'
import type { TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ className, label, error, hint, id, rows = 4, ...props }: Props) {
  const textareaId = id ?? props.name
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={textareaId}>
      {label ? <span className="font-medium text-[var(--color-text)]">{label}</span> : null}
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          'min-h-24 w-full resize-y rounded-md border bg-[var(--color-surface)] px-3 py-2 outline-none transition-colors',
          'border-[var(--color-divider)] focus:border-[var(--color-primary)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
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
