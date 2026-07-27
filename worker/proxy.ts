/**
 * Optional upstream API proxy (clouapp-style catch-all).
 * When `API_PROXY_TARGET` is set, `/api/*` is forwarded to that base URL.
 * When unset/empty, the in-worker mock (`handleApiRequest`) is used instead.
 */

const REQUEST_TIMEOUT_MS = 30_000

const HEADERS_TO_FORWARD = [
  'content-type',
  'authorization',
  'accept',
  'accept-language',
  'user-agent',
  'x-forwarded-for',
  'x-real-ip',
  'x-csrf-token',
  'x-requested-with',
  'origin',
  'referer',
  'cf-connecting-ip',
  'cf-ray',
  'cf-visitor',
  'cf-ipcountry',
  'cf-request-id',
  'cf-worker',
  'cf-ew-via',
] as const

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
])

export type ApiProxyEnv = {
  API_PROXY_TARGET?: string
}

function readProcessEnv(name: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined
  const value = process.env[name]
  return typeof value === 'string' ? value : undefined
}

/** Resolve proxy base URL from Worker bindings or `process.env`. Empty → mock. */
export function resolveApiProxyTarget(env?: ApiProxyEnv): string | undefined {
  const raw = env?.API_PROXY_TARGET ?? readProcessEnv('API_PROXY_TARGET')
  if (raw == null) return undefined
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed.replace(/\/+$/, '') : undefined
}

function apiPathFromUrl(url: URL): string {
  const pathname = url.pathname.startsWith('/api')
    ? url.pathname.slice('/api'.length) || '/'
    : url.pathname
  return pathname.replace(/^\/+/, '')
}

function buildTargetUrl(targetBase: string, requestUrl: URL): string {
  const apiPath = apiPathFromUrl(requestUrl)
  const target = new URL(apiPath ? `${targetBase}/${apiPath}` : `${targetBase}/`)
  target.search = requestUrl.search
  return target.toString()
}

function forwardRequestHeaders(request: Request): Headers {
  const headers = new Headers()
  for (const name of HEADERS_TO_FORWARD) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }
  return headers
}

function filterResponseHeaders(upstream: Headers): Headers {
  const headers = new Headers()
  upstream.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return
    headers.set(key, value)
  })
  headers.set('cache-control', 'no-store')
  return headers
}

/**
 * Forward the incoming `/api/*` request to `targetBase`, preserving method,
 * selected headers, query string, and body (clouapp `[...path]` pattern).
 */
export async function proxyApiRequest(
  request: Request,
  url: URL,
  targetBase: string,
): Promise<Response> {
  if (!targetBase.trim()) {
    throw new Error('proxyApiRequest requires a non-empty targetBase')
  }

  const method = request.method.toUpperCase()
  const targetUrl = buildTargetUrl(targetBase.replace(/\/+$/, ''), url)
  const headers = forwardRequestHeaders(request)

  const init: RequestInit = {
    method,
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    redirect: 'manual',
  }

  if (method !== 'GET' && method !== 'HEAD') {
    const body = await request.arrayBuffer()
    if (body.byteLength > 0) {
      init.body = body
    }
  }

  try {
    const upstream = await fetch(targetUrl, init)
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: filterResponseHeaders(upstream.headers),
    })
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === 'TimeoutError' ||
        error.name === 'AbortError' ||
        error.message.toLowerCase().includes('timeout'))

    if (isTimeout) {
      return Response.json(
        {
          error: 'Gateway Timeout',
          message: 'The request to the backend server timed out',
        },
        { status: 504, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    const isProduction = readProcessEnv('NODE_ENV') === 'production'
    return Response.json(
      {
        error: 'Internal proxy error',
        message: isProduction
          ? 'Something went wrong'
          : error instanceof Error
            ? error.message
            : 'Unknown proxy error',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
