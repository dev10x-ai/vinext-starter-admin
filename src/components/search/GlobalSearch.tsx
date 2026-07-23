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
        className="relative hidden min-w-[220px] flex-1 items-center gap-2 rounded-md border border-[var(--color-divider)] bg-[var(--color-background)] px-3 py-2 text-left text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] md:flex md:max-w-md"
        aria-label="Search"
      >
        <Search size={16} className="shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 truncate">Search console…</span>
        <kbd className="shrink-0 rounded border border-[var(--color-divider)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
          {shortcutLabel()}
        </kbd>
      </button>

      <button
        type="button"
        onClick={openPalette}
        className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] md:hidden"
        aria-label="Open search"
      >
        <Search size={18} />
      </button>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  )
}
