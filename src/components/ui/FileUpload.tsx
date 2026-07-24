import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import type { InputHTMLAttributes, ChangeEvent } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  label?: string
  error?: string
  hint?: string
  value?: FileList | null
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  /** Shown when no files are selected (uncontrolled display). */
  emptyLabel?: string
}

function formatFileSummary(files: FileList | null | undefined): string | null {
  if (!files || files.length === 0) return null
  if (files.length === 1) return files[0]?.name ?? null
  return `${files.length} files selected`
}

export function FileUpload({
  className,
  label,
  error,
  hint,
  id,
  value,
  onChange,
  emptyLabel = 'No file selected',
  disabled,
  ...props
}: Props) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const [uncontrolledSummary, setUncontrolledSummary] = useState<string | null>(null)
  const isControlled = value !== undefined
  const summary = isControlled ? formatFileSummary(value) : uncontrolledSummary

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledSummary(formatFileSummary(event.target.files))
    }
    onChange?.(event)
  }

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      {label ? (
        <label htmlFor={inputId} className="font-medium text-[var(--color-text)]">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'flex flex-col gap-2 rounded-md border border-dashed border-[var(--color-divider)] bg-[var(--color-surface)] px-3 py-3 sm:flex-row sm:items-center',
          disabled && 'opacity-50',
          error && 'border-[var(--color-danger)]',
          className,
        )}
      >
        <input
          id={inputId}
          type="file"
          disabled={disabled}
          className={cn(
            'min-h-11 w-full flex-1 text-sm text-[var(--color-text)] outline-none',
            'file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-accent)] file:px-3 file:py-2',
            'file:text-sm file:font-medium file:text-[var(--color-text)]',
            'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
          )}
          onChange={handleChange}
          {...props}
        />
        <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
          {summary ?? emptyLabel}
        </span>
      </div>
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-[var(--color-text-muted)]">{hint}</span> : null}
    </div>
  )
}
