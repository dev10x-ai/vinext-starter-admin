import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, CornerDownLeft, FileCog, Loader2, Search, User, X } from 'lucide-react'
import { useSearchQuery } from '@/queries'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  flattenSearchGroups,
  groupSearchResults,
  type SearchResult,
  type SearchResultType,
} from '@/lib/globalSearch'
import { cn } from '@/lib/cn'

const DEBOUNCE_MS = 200

const TYPE_ICON: Record<SearchResultType, typeof User> = {
  user: User,
  tenant: Building2,
  setting: FileCog,
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS)
  const { data, isFetching, isError, error } = useSearchQuery(debouncedQuery, open)

  const groups = useMemo(() => groupSearchResults(data?.results ?? []), [data?.results])
  const flatResults = useMemo(() => flattenSearchGroups(groups), [groups])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveIndex(0)
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [debouncedQuery, data?.results])

  useEffect(() => {
    if (!open) return
    const option = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    option?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open, flatResults.length])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  const selectResult = (result: SearchResult) => {
    if (!result?.url?.startsWith('/')) {
      throw new Error('Search result url must be an absolute app path')
    }
    onOpenChange(false)
    void navigate(result.url)
  }

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (flatResults.length === 0) return
      setActiveIndex((index) => (index + 1) % flatResults.length)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (flatResults.length === 0) return
      setActiveIndex((index) => (index - 1 + flatResults.length) % flatResults.length)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const result = flatResults[activeIndex]
      if (result) selectResult(result)
    }
  }

  if (!open) return null

  const showEmpty =
    !isFetching && !isError && query.trim().length > 0 && flatResults.length === 0
  const showSuggestionsHint = !query.trim() && flatResults.length > 0

  const indexedGroups = (() => {
    let cursor = 0
    return groups.map((group) => ({
      ...group,
      items: group.items.map((result) => {
        const index = cursor
        cursor += 1
        return { result, index }
      }),
    }))
  })()

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 p-4 pt-[12vh] sm:pt-[14vh]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false)
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search console"
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface)] shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-divider)] px-3 py-2.5">
          <Search size={18} className="shrink-0 text-[var(--color-text-muted)]" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search users, tenants, settings…"
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
            aria-label="Search query"
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              flatResults[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
          {isFetching ? (
            <Loader2 size={16} className="animate-spin text-[var(--color-text-muted)]" aria-label="Loading" />
          ) : null}
          <kbd className="hidden rounded border border-[var(--color-divider)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)] sm:inline">
            Esc
          </kbd>
          <button
            type="button"
            className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)]"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
          >
            <X size={16} />
          </button>
        </div>

        <div
          id={listboxId}
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(24rem,50vh)] overflow-y-auto p-2"
        >
          {isError ? (
            <p className="px-3 py-6 text-center text-sm text-[var(--color-danger)]">
              {error instanceof Error ? error.message : 'Search failed'}
            </p>
          ) : null}

          {showEmpty ? (
            <p className="px-3 py-6 text-center text-sm text-[var(--color-text-muted)]">
              No results for “{query.trim()}”
            </p>
          ) : null}

          {showSuggestionsHint ? (
            <p className="px-2 pb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Suggested
            </p>
          ) : null}

          {indexedGroups.map((group) => (
            <div key={group.type} className="mb-1.5 last:mb-0">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ result, index }) => {
                  const Icon = TYPE_ICON[result.type]
                  const active = index === activeIndex
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      id={`${listboxId}-opt-${index}`}
                      type="button"
                      role="option"
                      data-index={index}
                      aria-selected={active}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
                        active
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'hover:bg-[var(--color-accent)]',
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectResult(result)}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                          active ? 'bg-white/15' : 'bg-[var(--color-accent)] text-[var(--color-text-muted)]',
                        )}
                      >
                        <Icon size={16} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn('block truncate text-sm font-medium', !active && 'text-[var(--color-text)]')}>
                          {result.title}
                        </span>
                        {result.subtitle ? (
                          <span
                            className={cn(
                              'block truncate text-xs',
                              active ? 'text-white/80' : 'text-[var(--color-text-muted)]',
                            )}
                          >
                            {result.subtitle}
                          </span>
                        ) : null}
                      </span>
                      <CornerDownLeft
                        size={14}
                        className={cn('shrink-0 opacity-0', active && 'opacity-80')}
                        aria-hidden
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-[var(--color-divider)] px-3 py-2 text-[11px] text-[var(--color-text-muted)]">
          <span>↑↓ navigate · Enter open · Esc close</span>
          <span className="hidden sm:inline">Users · Tenants · Settings</span>
        </div>
      </div>
    </div>
  )
}

export function useCommandPaletteShortcut(onOpen: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return
      event.preventDefault()
      onOpen()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onOpen])
}
