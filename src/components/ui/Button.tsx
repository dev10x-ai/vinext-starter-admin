import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-opacity disabled:opacity-50',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-5 py-2.5 text-base',
        variant === 'primary' && 'bg-[var(--color-primary)] text-white hover:opacity-90',
        variant === 'secondary' &&
          'border border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-accent)]',
        variant === 'ghost' && 'text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)]',
        variant === 'danger' && 'bg-[var(--color-danger)] text-white hover:opacity-90',
        className,
      )}
      {...props}
    />
  )
}
