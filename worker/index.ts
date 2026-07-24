import { handleApiRequest } from './api'

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

async function fetchAsset(env: Env, request: Request, pathname: string): Promise<Response> {
  const url = new URL(request.url)
  url.pathname = pathname
  return env.ASSETS.fetch(new Request(url.toString(), request))
}

/**
 * Single Worker entry:
 * - `/api/*` → mock API
 * - `/docs` + `/docs/*` → Docusaurus static assets (404.html fallback)
 * - everything else → admin app assets (SPA fallback)
 *
 * Prefer vinext App Router handlers at `app/api/[[...path]]/route.ts`
 * with `vinext deploy` / `vinext start`. This entry remains for
 * `wrangler deploy --config wrangler.admin.toml` (CI tag/preview).
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const { pathname } = url

    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return handleApiRequest(request, url)
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

    const assetResponse = await env.ASSETS.fetch(request)
    if (assetResponse.status !== 404) {
      return assetResponse
    }

    return fetchAsset(env, request, '/index.html')
  },
}
