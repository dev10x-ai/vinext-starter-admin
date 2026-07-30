import { afterEach, describe, expect, it, vi } from 'vitest'
import { dispatchApiRequest } from './api'
import { resetDb } from './db'

describe('dispatchApiRequest', () => {
  afterEach(() => {
    resetDb()
    vi.restoreAllMocks()
  })

  it('serves the local mock even when a legacy proxy target is supplied', async () => {
    const outboundFetch = vi.fn(async () => Response.json([{ id: 'external' }]))
    vi.stubGlobal('fetch', outboundFetch)

    const request = new Request('http://localhost/api/users')
    const response = await Reflect.apply(dispatchApiRequest, undefined, [
      request,
      new URL(request.url),
      { API_PROXY_TARGET: 'https://api.example.com' },
    ])

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1', email: 'admin@acp.local' }),
      ]),
    )
    expect(outboundFetch).not.toHaveBeenCalled()
  })
})
