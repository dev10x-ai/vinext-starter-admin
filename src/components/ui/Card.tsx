import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-divider)] bg-[var(--color-card)] p-4 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
