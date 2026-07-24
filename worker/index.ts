import { handleApiRequest } from './api'

export interface Env {
  ASSETS: Fetcher
}

/**
 * Cloudflare Worker entry:
 * - `/api/*` → in-Worker mock API (seeded from mock/db.json)
 * - everything else → Vite SPA static assets
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
