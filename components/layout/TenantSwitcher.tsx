import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { Building2, Check, ChevronDown } from 'lucide-react'
import { useTenantsQuery } from '@/queries'
import { useUiStore } from '@/store/ui'
import { cn } from '@/lib/cn'

export function TenantSwitcher() {
  const tenantId = useUiStore((s) => s.tenantId)
  const setTenantId = useUiStore((s) => s.setTenantId)
  const { data: tenants = [] } = useTenantsQuery()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const selected = useMemo(
    () => tenants.find((tenant) => tenant.id === tenantId) ?? tenants[0] ?? null,
    [tenants, tenantId],
  )
  const displayName = selected?.name ?? 'Select tenant'

  useEffect(() => {
    if (!open) return

    const selectedIndex = Math.max(
      0,
      tenants.findIndex((tenant) => tenant.id === (tenantId ?? selected?.id)),
    )
    setActiveIndex(selectedIndex)
    listRef.current?.focus()

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, selected?.id, tenantId, tenants])

  useEffect(() => {
    if (!open) return
    const option = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    option?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const selectTenant = (id: string) => {
    if (!id) throw new Error('tenantId is required')
    setTenantId(id)
    setOpen(false)
  }

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (tenants.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % tenants.length)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + tenants.length) % tenants.length)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(tenants.length - 1)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const tenant = tenants[activeIndex]
      if (tenant) selectTenant(tenant.id)
    }
  }

  return (
    <div className="relative min-w-0" ref={rootRef}>
      <button
        type="button"
        className={cn(
          // Mobile: icon-only so header keeps room for notifications + user menu.
          'flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
          'max-w-[2.75rem] sm:max-w-[140px] sm:justify-start md:max-w-[180px]',
          'text-[var(--color-text)] hover:bg-[var(--color-accent)]',
          open && 'bg-[var(--color-accent)]',
        )}
        aria-label="Tenant"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onTriggerKeyDown}
      >
        <Building2 size={16} className="shrink-0 text-[var(--color-text-muted)]" aria-hidden />
        <span className="hidden min-w-0 truncate sm:inline">{displayName}</span>
        <ChevronDown
          size={14}
          className={cn(
            'hidden shrink-0 text-[var(--color-text-muted)] transition-transform sm:inline',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id={menuId}
          ref={listRef}
          role="listbox"
          aria-label="Tenants"
          tabIndex={-1}
          className="absolute left-0 z-40 mt-2 min-w-[220px] max-w-[min(20rem,calc(100vw-2rem))] rounded-md border border-[var(--color-divider)] bg-[var(--color-surface)] p-1 shadow-lg outline-none"
          onKeyDown={onMenuKeyDown}
        >
          {tenants.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-[var(--color-text-muted)]">No tenants</p>
          ) : (
            tenants.map((tenant, index) => {
              const isSelected = tenant.id === (tenantId ?? selected?.id)
              const isActive = index === activeIndex
              return (
                <button
                  key={tenant.id}
                  type="button"
                  role="option"
                  data-index={index}
                  aria-selected={isSelected}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                    'hover:bg-[var(--color-accent)]',
                    (isSelected || isActive) && 'bg-[var(--color-accent)]',
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectTenant(tenant.id)}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[var(--color-text)]">
                      {tenant.name}
                    </span>
                    <span className="block truncate font-mono text-xs text-[var(--color-text-muted)]">
                      {tenant.slug || tenant.id}
                    </span>
                  </span>
                  {isSelected ? (
                    <Check size={14} className="shrink-0 text-[var(--color-primary)]" aria-hidden />
                  ) : null}
                </button>
              )
            })
          )}
        </div>
      ) : null}
    </div>
  )
}
