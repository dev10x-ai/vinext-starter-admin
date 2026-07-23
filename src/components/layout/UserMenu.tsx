import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Monitor, Moon, Paintbrush, Palette, Settings, Sun, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import { themes } from '@/config/themes'
import type { ColorMode, ThemeId } from '@/types'
import { cn } from '@/lib/cn'

const APPEARANCE_OPTIONS: { value: ColorMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'dark', label: 'Dark', icon: Moon },
]

export function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const themeId = useThemeStore((s) => s.themeId)
  const mode = useThemeStore((s) => s.mode)
  const setTheme = useThemeStore((s) => s.setTheme)
  const setMode = useThemeStore((s) => s.setMode)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const displayName = user?.name?.trim() || user?.email || 'Admin'
  const initial = displayName.slice(0, 1).toUpperCase()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm',
          'hover:bg-[var(--color-accent)]',
          open && 'bg-[var(--color-accent)]',
        )}
        aria-label="Open user menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)] text-sm font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[140px] truncate text-left text-sm font-semibold md:inline">
          {displayName}
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-40 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] rounded-md border border-[var(--color-divider)] bg-[var(--color-surface)] p-3 shadow-lg"
        >
          <Link
            to="/app/profile"
            role="menuitem"
            className="flex w-full items-center gap-3 rounded-md bg-[var(--color-accent)] px-3 py-3 hover:opacity-90"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)] text-white">
              <User size={20} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[var(--color-text)]">
                {displayName}
              </span>
              {user?.email ? (
                <span className="block truncate text-xs text-[var(--color-text-muted)]">
                  {user.email}
                </span>
              ) : null}
            </span>
          </Link>

          <div className="mt-2 grid grid-cols-2 gap-1">
            <Link
              to="/app/profile"
              role="menuitem"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-accent)]"
              onClick={() => setOpen(false)}
            >
              <User size={16} />
              Profile
            </Link>
            <Link
              to="/app/settings"
              role="menuitem"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-accent)]"
              onClick={() => setOpen(false)}
            >
              <Settings size={16} />
              Settings
            </Link>
          </div>

          <div className="my-2 h-px bg-[var(--color-divider)]" />

          <div className="space-y-2">
            <p className="flex items-center gap-1.5 px-1 text-sm font-semibold text-[var(--color-text)]">
              <Palette size={16} />
              Appearance
            </p>
            <div
              className="grid grid-cols-3 gap-1 rounded-md bg-[var(--color-accent)] p-1"
              role="group"
              aria-label="Appearance"
            >
              {APPEARANCE_OPTIONS.map(({ value, label, icon: Icon }) => {
                const active = mode === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    title={label}
                    aria-label={label}
                    className={cn(
                      'flex items-center justify-center rounded-md py-2 transition-colors',
                      active
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                    )}
                    onClick={() => setMode(value)}
                  >
                    <Icon size={16} />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="my-2 h-px bg-[var(--color-divider)]" />

          <div className="space-y-2">
            <p className="flex items-center gap-1.5 px-1 text-sm font-semibold text-[var(--color-text)]">
              <Paintbrush size={16} />
              Theme
            </p>
            <div
              className="grid grid-cols-3 gap-1 rounded-md bg-[var(--color-accent)] p-1"
              role="group"
              aria-label="Theme"
            >
              {(Object.values(themes) as (typeof themes)[ThemeId][]).map((preset) => {
                const active = themeId === preset.id
                const swatch = preset.dark['--color-primary']
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    aria-label={preset.name}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-md px-1 py-2 text-xs font-medium transition-colors',
                      active
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                    )}
                    onClick={() => setTheme(preset.id)}
                  >
                    <span
                      className="inline-block h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: swatch }}
                      aria-hidden
                    />
                    {preset.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="my-2 h-px bg-[var(--color-divider)]" />

          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--color-accent)]"
            onClick={() => {
              setOpen(false)
              logout()
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}
