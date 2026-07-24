import handler from 'vinext/server/app-router-entry'
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
 * Single Worker:
 * - `/api/*` → in-Worker mock API (also available via App Router handlers)
 * - `/docs` + `/docs/*` → Docusaurus static assets under dist/client/docs
 * - everything else → vinext App Router (RSC/SSR)
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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

    return handler.fetch(request, env, ctx)
  },
}
