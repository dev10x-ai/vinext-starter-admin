import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, resolveColorMode, themes } from './index'

describe('themes', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-mode')
    document.documentElement.removeAttribute('data-effective-mode')
    document.documentElement.classList.remove('dark')
    document.documentElement.style.cssText = ''
  })

  it('ships Default, Ruby, and Emerald packs', () => {
    expect(Object.keys(themes).sort()).toEqual(['default', 'emerald', 'ruby'])
    expect(themes.default.name).toBe('Default')
    expect(themes.ruby.name).toBe('Ruby')
    expect(themes.emerald.name).toBe('Emerald')
  })

  it('applies Default light tokens and dataset', () => {
    applyTheme('default', 'light')
    expect(document.documentElement.dataset.theme).toBe('default')
    expect(document.documentElement.dataset.mode).toBe('light')
    expect(document.documentElement.dataset.effectiveMode).toBe('light')
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#1B4F8A')
  })

  it('applies Ruby red and black tokens in light and dark', () => {
    applyTheme('ruby', 'light')
    expect(document.documentElement.dataset.theme).toBe('ruby')
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#B91C1C')
    expect(document.documentElement.style.getPropertyValue('--color-secondary')).toBe('#171717')
    expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#FAFAFA')

    applyTheme('ruby', 'dark')
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#EF4444')
    expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#000000')
    expect(document.documentElement.style.getPropertyValue('--color-surface')).toBe('#0C0C0C')
  })

  it('toggles dark class for night mode', () => {
    applyTheme('emerald', 'dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('resolves system mode from prefers-color-scheme', () => {
    const matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    vi.stubGlobal('matchMedia', matchMedia)

    expect(resolveColorMode('system')).toBe('dark')
    applyTheme('ruby', 'system')
    expect(document.documentElement.dataset.mode).toBe('system')
    expect(document.documentElement.dataset.effectiveMode).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#EF4444')

    vi.unstubAllGlobals()
  })

  it('throws on unknown theme id', () => {
    expect(() => applyTheme('nope' as never, 'light')).toThrow(/Unknown theme id/)
  })
})
