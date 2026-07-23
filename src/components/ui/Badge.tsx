import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        tone === 'neutral' && 'bg-[var(--color-accent)] text-[var(--color-text-muted)]',
        tone === 'success' && 'bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]',
        tone === 'warning' && 'bg-[color-mix(in_srgb,var(--color-warning)_18%,transparent)] text-[var(--color-warning)]',
        tone === 'danger' && 'bg-[color-mix(in_srgb,var(--color-danger)_18%,transparent)] text-[var(--color-danger)]',
      )}
    >
      {children}
    </span>
  )
}
