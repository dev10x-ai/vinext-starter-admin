import { describe, expect, it } from 'vitest'
import { isViteClientAssetPath } from './staticPaths'

describe('isViteClientAssetPath', () => {
  it('matches Vite hashed client bundles', () => {
    expect(isViteClientAssetPath('/assets/index-Uq8yhUA0.js')).toBe(true)
    expect(isViteClientAssetPath('/assets/framework-ItqtACJ4.js')).toBe(true)
    expect(isViteClientAssetPath('/assets/worker-entry-CMNncPKl.css')).toBe(true)
  })

  it('matches Vite-dev module URLs required for hydration', () => {
    expect(isViteClientAssetPath('/@vite/client')).toBe(true)
    expect(isViteClientAssetPath('/@id/__x00__virtual:vite-rsc/entry-browser')).toBe(true)
    expect(isViteClientAssetPath('/node_modules/.vite/deps/react.js')).toBe(true)
    expect(isViteClientAssetPath('/styles/globals.css')).toBe(true)
    expect(
      isViteClientAssetPath('/app/(auth)/login/_components/login-view.tsx$$cache=rjgyucg2tn'),
    ).toBe(true)
    expect(isViteClientAssetPath('/layouts/AuthLayout.tsx$$cache=rjgyucg2tn')).toBe(true)
  })

  it('rejects app routes, docs, and public files', () => {
    expect(isViteClientAssetPath('/')).toBe(false)
    expect(isViteClientAssetPath('/login')).toBe(false)
    expect(isViteClientAssetPath('/app')).toBe(false)
    expect(isViteClientAssetPath('/app/access/users')).toBe(false)
    expect(isViteClientAssetPath('/assets')).toBe(false)
    expect(isViteClientAssetPath('/docs/assets/css/styles.css')).toBe(false)
    expect(isViteClientAssetPath('/favicon.ico')).toBe(false)
  })

  it('fails fast on invalid input', () => {
    expect(() => isViteClientAssetPath('')).toThrow(/non-empty string/)
  })
})
