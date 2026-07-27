/** Paths that must hit the Vite/ASSETS pipeline under `run_worker_first`. */
const VITE_MODULE_EXT = /\.(?:tsx?|jsx?|mjs|cjs|css|map)(?:$|\?)/

/**
 * Vite hashed client bundles (`/assets/*`) plus Vite-dev module URLs
 * (`/@vite/*`, `/@id/*`, source files, `$$cache=` client refs).
 *
 * With `run_worker_first`, these never reach ASSETS unless the Worker proxies
 * them — otherwise the App Router returns HTML 404s and the browser never
 * hydrates (`data-ready` stays false).
 */
export function isViteClientAssetPath(pathname: string): boolean {
  if (typeof pathname !== 'string' || pathname.length === 0) {
    throw new Error('isViteClientAssetPath: pathname must be a non-empty string')
  }

  // Docs have a dedicated Worker branch (trailing slash + 404.html).
  if (pathname === '/docs' || pathname.startsWith('/docs/')) return false

  if (pathname.startsWith('/assets/')) return true
  // Vite virtual / FS / optimized-dep URLs in `vinext dev`.
  if (pathname.startsWith('/@') || pathname.startsWith('/node_modules/')) return true
  // vinext client-reference URLs: `/app/providers.tsx$$cache=…`
  if (pathname.includes('$$cache=')) return true
  // Source modules and CSS served by Vite transform middleware in dev.
  if (VITE_MODULE_EXT.test(pathname)) return true

  return false
}
