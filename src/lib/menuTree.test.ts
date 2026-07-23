import { describe, expect, it } from 'vitest'
import type { MenuItem } from '@/types'
import {
  applyMenuProjection,
  applyReorderPatches,
  buildMenuTree,
  flattenMenuTree,
  flattenToReorderPatches,
  getDescendantIds,
  getDragProjection,
} from './menuTree'

const sample: MenuItem[] = [
  { id: '1', label: 'Dashboard', path: '/app', icon: 'LayoutDashboard', parentId: null, order: 1, enabled: true },
  { id: '2', label: 'Access', path: null, icon: 'Shield', parentId: null, order: 2, enabled: true },
  { id: '3', label: 'Users', path: '/users', icon: 'Users', parentId: '2', order: 1, enabled: true },
  { id: '4', label: 'Roles', path: '/roles', icon: 'Key', parentId: '2', order: 2, enabled: true },
  { id: '5', label: 'Settings', path: '/settings', icon: 'Settings', parentId: null, order: 3, enabled: true },
]

describe('menuTree', () => {
  it('builds a nested tree sorted by order', () => {
    const tree = buildMenuTree(sample)
    expect(tree.map((n) => n.id)).toEqual(['1', '2', '5'])
    expect(tree[1].children.map((n) => n.id)).toEqual(['3', '4'])
  })

  it('flattens with depth and parentId', () => {
    const flat = flattenMenuTree(buildMenuTree(sample))
    expect(flat.map((n) => [n.id, n.depth, n.parentId])).toEqual([
      ['1', 0, null],
      ['2', 0, null],
      ['3', 1, '2'],
      ['4', 1, '2'],
      ['5', 0, null],
    ])
  })

  it('lists descendant ids for collapse/drag exclusion', () => {
    const flat = flattenMenuTree(buildMenuTree(sample))
    expect(getDescendantIds(flat, '2')).toEqual(['3', '4'])
    expect(getDescendantIds(flat, '1')).toEqual([])
  })

  it('projects sibling reorder without depth change', () => {
    const flat = flattenMenuTree(buildMenuTree(sample))
    const projection = getDragProjection(flat, '5', '1', 0)
    expect(projection).toMatchObject({ depth: 0, parentId: null })
  })

  it('projects nesting under previous sibling when depth increases', () => {
    const flat = flattenMenuTree(buildMenuTree(sample))
    // Drop Settings onto Users: previous becomes Access → nest under Access
    const projection = getDragProjection(flat, '5', '3', 0)
    expect(projection?.parentId).toBe('2')
    expect(projection?.depth).toBe(1)
  })

  it('applies projection and rebuilds order patches', () => {
    const flat = flattenMenuTree(buildMenuTree(sample))
    // Move Roles before Users under Access
    const swapped = applyMenuProjection(flat, '4', '3', 1, '2')
    const patches = flattenToReorderPatches(swapped)
    const roles = patches.find((p) => p.id === '4')
    const users = patches.find((p) => p.id === '3')
    expect(roles?.order).toBeLessThan(users?.order ?? Number.POSITIVE_INFINITY)

    const next = applyReorderPatches(sample, patches)
    const accessChildren = next
      .filter((i) => i.parentId === '2')
      .sort((a, b) => a.order - b.order)
      .map((i) => i.id)
    expect(accessChildren[0]).toBe('4')
  })

  it('fails fast on invalid input', () => {
    expect(() => buildMenuTree(null as unknown as MenuItem[])).toThrow(/must be an array/)
    expect(() => getDragProjection([], '', '1', 0)).toThrow(/required/)
  })
})
