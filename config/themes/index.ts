import type { ColorMode, ThemeId } from '@/types'

export type ThemeTokens = {
  id: ThemeId
  name: string
  light: Record<string, string>
  dark: Record<string, string>
}

export function resolveColorMode(mode: ColorMode): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') return mode
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const themes: Record<ThemeId, ThemeTokens> = {
  default: {
    id: 'default',
    name: 'Default',
    light: {
      '--color-primary': '#1B4F8A',
      '--color-primary-hover': '#163F6E',
      '--color-secondary': '#3D7AB5',
      '--color-accent': '#E8EEF5',
      '--color-surface': '#FFFFFF',
      '--color-background': '#F3F6FA',
      '--color-divider': '#D5DEE8',
      '--color-card': '#FFFFFF',
      '--color-text': '#152033',
      '--color-text-muted': '#5A6B7D',
      '--color-success': '#0F8A5F',
      '--color-warning': '#C98512',
      '--color-danger': '#C23B2A',
      '--font-display': '"Source Serif 4", Georgia, serif',
      '--font-body': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--hero-glow': 'rgba(27, 79, 138, 0.18)',
    },
    dark: {
      '--color-primary': '#5B9BD5',
      '--color-primary-hover': '#7BB0E0',
      '--color-secondary': '#3D7AB5',
      '--color-accent': '#1A2433',
      '--color-surface': '#121A24',
      '--color-background': '#0B1118',
      '--color-divider': '#2A3545',
      '--color-card': '#162131',
      '--color-text': '#E8EEF5',
      '--color-text-muted': '#9AABC0',
      '--color-success': '#2BB98A',
      '--color-warning': '#E0A93A',
      '--color-danger': '#E06A5A',
      '--font-display': '"Source Serif 4", Georgia, serif',
      '--font-body': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--hero-glow': 'rgba(91, 155, 213, 0.15)',
    },
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    light: {
      '--color-primary': '#B91C1C',
      '--color-primary-hover': '#991B1B',
      '--color-secondary': '#171717',
      '--color-accent': '#FEF2F2',
      '--color-surface': '#FFFFFF',
      '--color-background': '#FAFAFA',
      '--color-divider': '#E5E5E5',
      '--color-card': '#FFFFFF',
      '--color-text': '#0A0A0A',
      '--color-text-muted': '#525252',
      '--color-success': '#15803D',
      '--color-warning': '#C2410C',
      '--color-danger': '#DC2626',
      '--font-display': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--font-body': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--hero-glow': 'rgba(185, 28, 28, 0.16)',
    },
    dark: {
      '--color-primary': '#EF4444',
      '--color-primary-hover': '#F87171',
      '--color-secondary': '#7F1D1D',
      '--color-accent': '#1C0A0A',
      '--color-surface': '#0C0C0C',
      '--color-background': '#000000',
      '--color-divider': '#262626',
      '--color-card': '#141414',
      '--color-text': '#FAFAFA',
      '--color-text-muted': '#A3A3A3',
      '--color-success': '#22C55E',
      '--color-warning': '#F59E0B',
      '--color-danger': '#F87171',
      '--font-display': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--font-body': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--hero-glow': 'rgba(239, 68, 68, 0.18)',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    light: {
      '--color-primary': '#16A34A',
      '--color-primary-hover': '#15803D',
      '--color-secondary': '#368BC9',
      '--color-accent': '#F7F9FB',
      '--color-surface': '#FFFFFF',
      '--color-background': '#F9FAFB',
      '--color-divider': '#E1E4EB',
      '--color-card': '#FFFFFF',
      '--color-text': '#111827',
      '--color-text-muted': '#6B7280',
      '--color-success': '#00B58C',
      '--color-warning': '#F7C948',
      '--color-danger': '#F04438',
      '--font-display': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--font-body': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--hero-glow': 'rgba(22, 163, 74, 0.14)',
    },
    dark: {
      '--color-primary': '#22C55E',
      '--color-primary-hover': '#5EE349',
      '--color-secondary': '#368BC9',
      '--color-accent': '#2B2F37',
      '--color-surface': '#1B1E25',
      '--color-background': '#111318',
      '--color-divider': '#3F434C',
      '--color-card': '#212632',
      '--color-text': '#F2F4F8',
      '--color-text-muted': '#9CA0AF',
      '--color-success': '#00B58C',
      '--color-warning': '#F7C948',
      '--color-danger': '#F04438',
      '--font-display': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--font-body': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      '--hero-glow': 'rgba(34, 197, 94, 0.12)',
    },
  },
}

export function applyTheme(themeId: ThemeId, mode: ColorMode) {
  const pack = themes[themeId]
  if (!pack) {
    throw new Error(`Unknown theme id: ${themeId}`)
  }
  const effective = resolveColorMode(mode)
  const tokens = effective === 'dark' ? pack.dark : pack.light
  const root = document.documentElement
  Object.entries(tokens).forEach(([key, value]) => root.style.setProperty(key, value))
  root.dataset.theme = themeId
  root.dataset.mode = mode
  root.dataset.effectiveMode = effective
  root.classList.toggle('dark', effective === 'dark')
  root.style.colorScheme = effective
}
