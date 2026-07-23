import { useCallback, useState } from 'react'
import { Search } from 'lucide-react'
import { CommandPalette, useCommandPaletteShortcut } from '@/components/search/CommandPalette'

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
        className="relative flex min-w-0 flex-1 items-center gap-2 rounded-md border border-[var(--color-divider)] bg-[var(--color-background)] px-2.5 py-2 text-left text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] sm:px-3 md:max-w-md md:min-w-[220px]"
        aria-label="Search"
      >
        <Search size={16} className="shrink-0" aria-hidden />
        <span className="hidden min-w-0 flex-1 truncate sm:inline">Search console…</span>
        <kbd className="ml-auto shrink-0 rounded border border-[var(--color-divider)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
          {shortcutLabel()}
        </kbd>
      </button>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  )
}
