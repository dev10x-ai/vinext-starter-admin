import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColorMode, ThemeId } from '@/types'
import { applyTheme } from '@/config/themes'

type ThemeState = {
  themeId: ThemeId
  mode: ColorMode
  setTheme: (id: ThemeId) => void
  setMode: (mode: ColorMode) => void
  toggleMode: () => void
  hydrate: () => void
}

const THEME_IDS: ThemeId[] = ['default', 'ruby', 'emerald']
const COLOR_MODES: ColorMode[] = ['light', 'dark', 'system']

/** Legacy keys persisted before the default/ruby/emerald rename. */
const LEGACY_THEME_IDS: Record<string, ThemeId> = {
  acp: 'default',
  xip: 'ruby',
  macro: 'emerald',
}

let systemMedia: MediaQueryList | null = null
let systemListener: (() => void) | null = null

export function migrateThemeId(value: unknown): ThemeId | null {
  if (typeof value !== 'string') return null
  if (THEME_IDS.includes(value as ThemeId)) return value as ThemeId
  return LEGACY_THEME_IDS[value] ?? null
}

function isColorMode(value: unknown): value is ColorMode {
  return typeof value === 'string' && COLOR_MODES.includes(value as ColorMode)
}

function syncDom(themeId: ThemeId, mode: ColorMode) {
  applyTheme(themeId, mode)
}

function bindSystemPreferenceListener() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  if (systemListener && systemMedia) {
    systemMedia.removeEventListener('change', systemListener)
  }
  systemMedia = window.matchMedia('(prefers-color-scheme: dark)')
  systemListener = () => {
    const { mode, themeId } = useThemeStore.getState()
    if (mode === 'system') syncDom(themeId, mode)
  }
  systemMedia.addEventListener('change', systemListener)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeId: 'default',
      mode: 'system',
      setTheme(id) {
        const next = migrateThemeId(id)
        if (!next) {
          throw new Error(`Invalid theme id: ${String(id)}`)
        }
        set({ themeId: next })
        syncDom(next, get().mode)
      },
      setMode(mode) {
        if (!isColorMode(mode)) {
          throw new Error(`Invalid color mode: ${String(mode)}`)
        }
        set({ mode })
        syncDom(get().themeId, mode)
      },
      toggleMode() {
        const current = get().mode
        const next: ColorMode =
          current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
        get().setMode(next)
      },
      hydrate() {
        const { themeId, mode } = get()
        const safeTheme = migrateThemeId(themeId) ?? 'default'
        const safeMode = isColorMode(mode) ? mode : 'system'
        if (safeTheme !== themeId || safeMode !== mode) {
          set({ themeId: safeTheme, mode: safeMode })
        }
        syncDom(safeTheme, safeMode)
        bindSystemPreferenceListener()
      },
    }),
    {
      name: 'acp-theme',
      version: 1,
      partialize: (s) => ({ themeId: s.themeId, mode: s.mode }),
      migrate: (persisted) => {
        const state = (persisted ?? {}) as { themeId?: unknown; mode?: unknown }
        return {
          themeId: migrateThemeId(state.themeId) ?? 'default',
          mode: isColorMode(state.mode) ? state.mode : 'system',
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.hydrate()
      },
    },
  ),
)
