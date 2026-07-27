'use client'

import Link from 'next/link'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

const MENU_VIEWPORT_GAP = 8

function menuPosition(trigger: DOMRect): { top: number; left: number; width: number } {
  const maxWidth = Math.min(22 * 16, window.innerWidth - MENU_VIEWPORT_GAP * 2)
  if (!Number.isFinite(maxWidth) || maxWidth <= 0) {
    throw new Error('UserMenu cannot position dropdown: invalid viewport width')
  }

  const preferredLeft = trigger.right - maxWidth
  const left = Math.min(
    Math.max(MENU_VIEWPORT_GAP, preferredLeft),
    window.innerWidth - maxWidth - MENU_VIEWPORT_GAP,
  )
  const top = trigger.bottom + MENU_VIEWPORT_GAP

  return { top, left, width: maxWidth }
}

export function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const themeId = useThemeStore((s) => s.themeId)
  const mode = useThemeStore((s) => s.mode)
  const setTheme = useThemeStore((s) => s.setTheme)
  const setMode = useThemeStore((s) => s.setMode)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const displayName = user?.name?.trim() || user?.email || 'Admin'
  const initial = displayName.slice(0, 1).toUpperCase()

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return
    }

    const updatePosition = () => {
      const trigger = triggerRef.current?.getBoundingClientRect()
      if (!trigger) return
      setCoords(menuPosition(trigger))
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return
      }
      setOpen(false)
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

  const menu =
    open && coords
      ? createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            className="z-50 rounded-md border border-[var(--color-divider)] bg-[var(--color-surface)] p-3 shadow-lg"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
          >
            <Link
              href="/app/profile"
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
                href="/app/profile"
                role="menuitem"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-accent)]"
                onClick={() => setOpen(false)}
              >
                <User size={16} />
                Profile
              </Link>
              <Link
                href="/app/settings"
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
          </div>,
          document.body,
        )
      : null

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          'flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-transparent px-1.5 py-1.5 text-sm md:px-2',
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

      {menu}
    </div>
  )
}