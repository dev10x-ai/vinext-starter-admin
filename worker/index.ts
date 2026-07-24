import handler from 'vinext/server/app-router-entry'
import { handleApiRequest } from './api'
import { isViteClientAssetPath } from './staticPaths'

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

interface WorkerExecutionContext {
  waitUntil(promise: Promise<unknown>): void
  passThroughOnException(): void
}

async function fetchAsset(env: Env, request: Request, pathname: string): Promise<Response> {
  const url = new URL(request.url)
  url.pathname = pathname
  return env.ASSETS.fetch(new Request(url.toString(), request))
}

/**
 * Single Worker (`run_worker_first = true` — ASSETS are not auto-served):
 * - `/api/*` → in-Worker mock API (also available via App Router handlers)
 * - `/assets/*` → Vite hashed client JS/CSS from `dist/client/assets`
 * - `/docs` + `/docs/*` → Docusaurus under `dist/client/docs`
 * - everything else → vinext App Router (RSC/SSR); `public/` files still
 *   resolve via vinext's ASSETS static-file signal (favicon, branding, …)
 */
export default {
  async fetch(request: Request, env: Env, ctx: WorkerExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const { pathname } = url

    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return handleApiRequest(request, url)
    }

    // Vite client chunks are not in vinext's publicFiles set; with
    // run_worker_first they never reach ASSETS unless we proxy them here.
    if (isViteClientAssetPath(pathname)) {
      return env.ASSETS.fetch(request)
    }

    if (pathname === '/docs' || pathname.startsWith('/docs/')) {
      if (pathname === '/docs') {
        const redirectUrl = new URL(url)
        redirectUrl.pathname = '/docs/'
        return Response.redirect(redirectUrl.toString(), 308)
      }

      const docsResponse = await env.ASSETS.fetch(request)
      if (docsResponse.status !== 404) {
        return docsResponse
      }

      const notFoundResponse = await fetchAsset(env, request, '/docs/404.html')
      return new Response(notFoundResponse.body, {
        status: 404,
        statusText: 'Not Found',
        headers: notFoundResponse.headers,
      })
    }

    return handler.fetch(request, env, ctx)
  },
}
