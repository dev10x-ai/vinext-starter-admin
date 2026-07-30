import { describe, expect, it } from 'vitest'

const settingPages = import.meta.glob('./*/page.tsx')

describe('platform settings routes', () => {
  it('publishes a route for every settings section in the navigation', () => {
    expect(Object.keys(settingPages).sort()).toEqual([
      './ai/page.tsx',
      './email/page.tsx',
      './logs/page.tsx',
      './third-party/page.tsx',
    ])
  })
})
