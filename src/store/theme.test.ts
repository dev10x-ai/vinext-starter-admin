import { beforeEach, describe, expect, it, vi } from 'vitest'
import { migrateThemeId, useThemeStore } from './theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-mode')
    document.documentElement.removeAttribute('data-effective-mode')
    document.documentElement.classList.remove('dark')
    document.documentElement.style.cssText = ''
    useThemeStore.setState({ themeId: 'default', mode: 'system' })
    useThemeStore.persist.clearStorage()
  })

  it('maps legacy theme keys to new ids', () => {
    expect(migrateThemeId('acp')).toBe('default')
    expect(migrateThemeId('xip')).toBe('ruby')
    expect(migrateThemeId('macro')).toBe('emerald')
    expect(migrateThemeId('default')).toBe('default')
    expect(migrateThemeId('unknown')).toBeNull()
  })

  it('applies brand theme tokens immediately', () => {
    useThemeStore.getState().setTheme('emerald')
    expect(useThemeStore.getState().themeId).toBe('emerald')
    expect(document.documentElement.dataset.theme).toBe('emerald')
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#16A34A')
  })

  it('persists theme and mode to localStorage', () => {
    useThemeStore.getState().setTheme('ruby')
    useThemeStore.getState().setMode('dark')

    const raw = localStorage.getItem('acp-theme')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!) as { state: { themeId: string; mode: string } }
    expect(parsed.state.themeId).toBe('ruby')
    expect(parsed.state.mode).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('migrates legacy localStorage theme keys on hydrate', async () => {
    localStorage.setItem(
      'acp-theme',
      JSON.stringify({ state: { themeId: 'xip', mode: 'light' }, version: 0 }),
    )
    await useThemeStore.persist.rehydrate()
    expect(useThemeStore.getState().themeId).toBe('ruby')
    expect(useThemeStore.getState().mode).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('ruby')
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#B91C1C')
  })

  it('updates DOM when OS preference changes under system mode', () => {
    let matches = false
    const listeners = new Set<() => void>()
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        get matches() {
          return matches
        },
        addEventListener: (_: string, cb: () => void) => {
          listeners.add(cb)
        },
        removeEventListener: (_: string, cb: () => void) => {
          listeners.delete(cb)
        },
      })),
    )

    useThemeStore.getState().setMode('system')
    useThemeStore.getState().hydrate()
    expect(document.documentElement.dataset.mode).toBe('system')
    expect(document.documentElement.dataset.effectiveMode).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    matches = true
    listeners.forEach((cb) => cb())
    expect(document.documentElement.dataset.effectiveMode).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    vi.unstubAllGlobals()
  })

  it('cycles appearance with toggleMode', () => {
    useThemeStore.setState({ mode: 'light' })
    useThemeStore.getState().toggleMode()
    expect(useThemeStore.getState().mode).toBe('dark')
    useThemeStore.getState().toggleMode()
    expect(useThemeStore.getState().mode).toBe('system')
    useThemeStore.getState().toggleMode()
    expect(useThemeStore.getState().mode).toBe('light')
  })
})
