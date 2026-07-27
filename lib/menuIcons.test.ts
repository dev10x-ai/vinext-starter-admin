import { describe, expect, it } from 'vitest'
import {
  MENU_ICON_NAMES,
  filterMenuIcons,
  isMenuIconName,
  resolveMenuIcon,
} from './menuIcons'

describe('menuIcons', () => {
  it('maps known Lucide names to components', () => {
    const Icon = resolveMenuIcon('LayoutDashboard')
    expect(Icon).toBeTruthy()
    expect(Icon).not.toBeNull()
    // lucide-react icons are forwardRef objects (typeof "object")
    expect(Icon === resolveMenuIcon('Users')).toBe(false)
    expect(resolveMenuIcon('LayoutDashboard')).toBe(Icon)
  })

  it('returns null for empty or unknown names', () => {
    expect(resolveMenuIcon('')).toBeNull()
    expect(resolveMenuIcon('   ')).toBeNull()
    expect(resolveMenuIcon(null)).toBeNull()
    expect(resolveMenuIcon(undefined)).toBeNull()
    expect(resolveMenuIcon('NotARealIcon')).toBeNull()
  })

  it('covers seed / admin nav icons used in mock data', () => {
    const seeded = [
      'LayoutDashboard',
      'Shield',
      'Users',
      'KeyRound',
      'ListTree',
      'Building2',
      'FolderTree',
      'Mail',
      'ScrollText',
      'BarChart3',
      'FileBarChart',
      'Activity',
      'Receipt',
      'Bell',
      'Settings',
      'SlidersHorizontal',
      'Plug',
      'Palette',
      'Type',
      'FormInput',
    ]
    for (const name of seeded) {
      expect(isMenuIconName(name)).toBe(true)
      expect(resolveMenuIcon(name)).toBeTruthy()
    }
  })

  it('filters by label or name', () => {
    const byName = filterMenuIcons('dashboard')
    expect(byName.some((e) => e.name === 'LayoutDashboard')).toBe(true)

    const byLabel = filterMenuIcons('users')
    expect(byLabel.some((e) => e.name === 'Users')).toBe(true)

    expect(filterMenuIcons('zzz-no-match')).toHaveLength(0)
  })

  it('exposes a non-empty curated name list', () => {
    expect(MENU_ICON_NAMES.length).toBeGreaterThan(20)
    expect(new Set(MENU_ICON_NAMES).size).toBe(MENU_ICON_NAMES.length)
  })
})
