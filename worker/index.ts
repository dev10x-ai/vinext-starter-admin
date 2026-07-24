import { handleApiRequest } from './api'

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

/**
 * Legacy SPA Worker entry (assets + `/api/*`).
 *
 * Prefer vinext App Router handlers at `src/app/api/[[...path]]/route.ts`
 * with `vinext deploy` / `vinext start`. Kept for `wrangler.dev` against a
 * static asset build when needed.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, url)
    }

    return env.ASSETS.fetch(request)
  },
}
