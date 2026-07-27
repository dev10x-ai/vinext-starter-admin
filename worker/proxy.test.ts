import { afterEach, describe, expect, it, vi } from 'vitest'
import { proxyApiRequest, resolveApiProxyTarget } from './proxy'

describe('resolveApiProxyTarget', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns undefined when unset or blank', () => {
    expect(resolveApiProxyTarget({})).toBeUndefined()
    expect(resolveApiProxyTarget({ API_PROXY_TARGET: '   ' })).toBeUndefined()
  })

  it('trims and strips trailing slashes from env binding', () => {
    expect(resolveApiProxyTarget({ API_PROXY_TARGET: ' https://api.example.com/v1/ ' })).toBe(
      'https://api.example.com/v1',
    )
  })

  it('falls back to process.env.API_PROXY_TARGET', () => {
    vi.stubEnv('API_PROXY_TARGET', 'https://backend.test')
    expect(resolveApiProxyTarget()).toBe('https://backend.test')
  })
})

describe('proxyApiRequest', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('forwards method, auth header, query, and JSON body', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const request = new Request('http://localhost/api/users?active=1', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer test-token',
        host: 'localhost',
      },
      body: JSON.stringify({ name: 'Ada' }),
    })

    const response = await proxyApiRequest(
      request,
      new URL(request.url),
      'https://api.example.com/v1',
    )

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ ok: true })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/v1/users?active=1',
      expect.objectContaining({ method: 'POST' }),
    )

    const init = fetchMock.mock.calls.at(0)?.at(1) as RequestInit | undefined
    expect(init).toBeDefined()
    if (!init) throw new Error('expected fetch init')
    const headers = new Headers(init.headers)
    expect(headers.get('authorization')).toBe('Bearer test-token')
    expect(headers.get('content-type')).toBe('application/json')
    expect(headers.get('host')).toBeNull()
    expect(new TextDecoder().decode(init.body as ArrayBuffer)).toBe('{"name":"Ada"}')
  })

  it('returns 504 when upstream times out', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        const error = new Error('The operation was aborted due to timeout')
        error.name = 'TimeoutError'
        throw error
      }),
    )

    const request = new Request('http://localhost/api/health')
    const response = await proxyApiRequest(
      request,
      new URL(request.url),
      'https://api.example.com',
    )

    expect(response.status).toBe(504)
    await expect(response.json()).resolves.toMatchObject({ error: 'Gateway Timeout' })
  })
})
