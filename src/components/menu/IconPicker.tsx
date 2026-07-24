import { useId, useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { filterMenuIcons, resolveMenuIcon } from '@/lib/menuIcons'

type IconPickerProps = {
  value: string
  onChange: (icon: string) => void
  disabled?: boolean
  error?: string
}

export function IconPicker({ value, onChange, disabled = false, error }: IconPickerProps) {
  if (typeof onChange !== 'function') {
    throw new Error('IconPicker requires onChange')
  }

  const searchId = useId()
  const [query, setQuery] = useState('')
  const icons = useMemo(() => filterMenuIcons(query), [query])
  const SelectedIcon = resolveMenuIcon(value)

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-[var(--color-text)]">Icon</span>
        <div className="flex items-center gap-2">
          {SelectedIcon ? (
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-primary)]"
              title={value}
            >
              <SelectedIcon size={16} aria-hidden />
            </span>
          ) : (
            <span className="text-xs text-[var(--color-text-muted)]">None</span>
          )}
          <button
            type="button"
            className={cn(
              'text-xs text-[var(--color-text-muted)] underline-offset-2 hover:underline',
              (!value || disabled) && 'pointer-events-none opacity-40',
            )}
            disabled={disabled || !value}
            onClick={() => onChange('')}
          >
            Clear
          </button>
        </div>
      </div>

      <label htmlFor={searchId} className="sr-only">
        Search icons
      </label>
      <input
        id={searchId}
        type="search"
        value={query}
        disabled={disabled}
        placeholder="Search icons…"
        onChange={(event) => setQuery(event.target.value)}
        className={cn(
          'rounded-md border bg-[var(--color-surface)] px-3 py-2 outline-none transition-colors',
          'border-[var(--color-divider)] focus:border-[var(--color-primary)]',
          error && 'border-[var(--color-danger)]',
        )}
      />

      <div
        role="listbox"
        aria-label="Menu icons"
        className={cn(
          'grid max-h-56 grid-cols-5 gap-1 overflow-y-auto rounded-md border border-[var(--color-divider)]',
          'bg-[var(--color-surface)] p-1.5 sm:grid-cols-8',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {icons.length === 0 ? (
          <p className="col-span-full px-2 py-3 text-center text-xs text-[var(--color-text-muted)]">
            No icons match “{query.trim()}”.
          </p>
        ) : (
          icons.map(({ name, label, Icon }) => {
            const selected = value === name
            return (
              <button
                key={name}
                type="button"
                role="option"
                aria-selected={selected}
                title={`${label} (${name})`}
                disabled={disabled}
                onClick={() => onChange(name)}
                className={cn(
                  'inline-flex min-h-11 w-full items-center justify-center rounded-md text-[var(--color-text)]',
                  'hover:bg-[var(--color-accent)] focus-visible:outline focus-visible:outline-2',
                  'focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)]',
                  selected &&
                    'bg-[var(--color-accent)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]',
                )}
              >
                <Icon size={18} aria-hidden />
                <span className="sr-only">{label}</span>
              </button>
            )
          })
        )}
      </div>

      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
      {!error ? (
        <span className="text-xs text-[var(--color-text-muted)]">
          Lucide icon name stored on the menu item. Optional — clear to hide.
        </span>
      ) : null}
    </div>
  )
}
