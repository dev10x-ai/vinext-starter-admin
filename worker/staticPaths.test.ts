import { describe, expect, it } from 'vitest'
import { isViteClientAssetPath } from './staticPaths'

describe('isViteClientAssetPath', () => {
  it('matches Vite hashed client bundles', () => {
    expect(isViteClientAssetPath('/assets/index-Uq8yhUA0.js')).toBe(true)
    expect(isViteClientAssetPath('/assets/framework-ItqtACJ4.js')).toBe(true)
    expect(isViteClientAssetPath('/assets/worker-entry-CMNncPKl.css')).toBe(true)
  })

  it('rejects app routes, docs, and public files', () => {
    expect(isViteClientAssetPath('/')).toBe(false)
    expect(isViteClientAssetPath('/login')).toBe(false)
    expect(isViteClientAssetPath('/assets')).toBe(false)
    expect(isViteClientAssetPath('/docs/assets/css/styles.css')).toBe(false)
    expect(isViteClientAssetPath('/favicon.ico')).toBe(false)
  })

  it('fails fast on invalid input', () => {
    expect(() => isViteClientAssetPath('')).toThrow(/non-empty string/)
  })
})
