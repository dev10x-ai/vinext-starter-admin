import { useId } from 'react'
import { cn } from '@/lib/cn'
import type { InputHTMLAttributes } from 'react'
import styles from './Switch.module.css'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: string
  error?: string
  hint?: string
  size?: 'sm' | 'md'
}

export function Switch({
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
          'inline-flex items-center gap-3',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className,
        )}
        htmlFor={inputId}
      >
        <span className={cn(styles.track, size === 'sm' && styles.trackSm)}>
          <input
            id={inputId}
            type="checkbox"
            role="switch"
            disabled={disabled}
            className={styles.input}
            {...props}
          />
          <span className={styles.thumb} aria-hidden />
        </span>
        {label ? <span className="font-medium text-[var(--color-text)]">{label}</span> : null}
      </label>
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-[var(--color-text-muted)]">{hint}</span> : null}
    </div>
  )
}
