import { useCallback, useState } from 'react'
import { Search } from 'lucide-react'
import { CommandPalette, useCommandPaletteShortcut } from '@/components/search/CommandPalette'
import { cn } from '@/lib/cn'
import styles from '@/layouts/AppShell.module.css'

function shortcutLabel() {
  if (typeof navigator === 'undefined') return '⌘K'
  const platform = navigator.platform?.toLowerCase() ?? ''
  const isApple = platform.includes('mac') || platform.includes('iphone') || platform.includes('ipad')
  return isApple ? '⌘K' : 'Ctrl+K'
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const openPalette = useCallback(() => setOpen(true), [])
  useCommandPaletteShortcut(openPalette)

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className={cn(
          // Mobile: icon-sized tap target. Desktop: full search field.
          styles.iconTap,
          'md:relative md:min-h-0 md:min-w-0 md:flex-1 md:justify-start md:gap-2',
          'md:rounded-md md:border md:border-[var(--color-divider)] md:bg-[var(--color-background)]',
          'md:px-3 md:py-2 md:text-left md:text-sm md:text-[var(--color-text-muted)]',
          'md:transition-colors md:hover:border-[var(--color-primary)] md:hover:bg-[var(--color-background)]',
          'md:max-w-md md:min-w-[220px]',
        )}
        aria-label="Search"
      >
        <Search size={16} className="shrink-0 md:size-4" aria-hidden />
        <span className="hidden min-w-0 flex-1 truncate md:inline">Search console…</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-[var(--color-divider)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)] md:inline">
          {shortcutLabel()}
        </kbd>
      </button>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  )
}
