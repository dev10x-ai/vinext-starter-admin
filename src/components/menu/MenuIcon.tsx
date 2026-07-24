import { cn } from '@/lib/cn'
import { resolveMenuIcon } from '@/lib/menuIcons'

type MenuIconProps = {
  name: string | null | undefined
  size?: number
  className?: string
  /** When true, uses primary color (e.g. selected / active row). */
  active?: boolean
}

export function MenuIcon({ name, size = 16, className, active = false }: MenuIconProps) {
  const Icon = resolveMenuIcon(name)
  if (!Icon) return null

  return (
    <Icon
      size={size}
      aria-hidden
      className={cn(
        'shrink-0',
        active ? 'text-[var(--color-primary)]' : 'text-current',
        className,
      )}
    />
  )
}
