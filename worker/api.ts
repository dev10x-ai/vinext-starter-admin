import {
  getCollection,
  getDb,
  isCollection,
  nextId,
  type CollectionName,
  type JsonRecord,
} from './db'
import { runHybridSearch } from './search'

const DEMO_OTP = '123456'
const API_PREFIX = '/api'

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function noContent(): Response {
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text()
  if (!text.trim()) return {}
  try {
    const parsed: unknown = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Request body must be a JSON object')
    }
    return parsed as Record<string, unknown>
  } catch (error) {
    if (error instanceof Error && error.message.includes('JSON object')) throw error
    throw new Error('Invalid JSON body')
  }
}

function stripPassword(user: JsonRecord): Record<string, unknown> {
  const { password: _password, ...safe } = user
  return safe
}

function applyListQuery(items: JsonRecord[], url: URL): JsonRecord[] {
  let result = [...items]
  const sort = url.searchParams.get('_sort')
  const order = (url.searchParams.get('_order') ?? 'asc').toLowerCase()

  if (sort) {
    result.sort((a, b) => {
      const av = a[sort]
      const bv = b[sort]
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'desc' ? bv - av : av - bv
      }
      const cmp = String(av).localeCompare(String(bv))
      return order === 'desc' ? -cmp : cmp
    })
  }

  return result
}

function handleAuth(method: string, parts: string[], body: Record<string, unknown>): Response | null {
  const action = parts.slice(1).join('/')

  if (method === 'POST' && action === 'login') {
    const email = typeof body.email === 'string' ? body.email : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const user = getCollection('users').find((u) => u.email === email && u.password === password)
    if (!user) return json({ message: 'Invalid email or password' }, 401)
    return json({
      requiresOtp: Boolean(user.twoFactorEnabled),
      user: stripPassword(user),
      token: user.twoFactorEnabled ? null : `mock-token-${user.id}`,
    })
  }

  if (method === 'POST' && action === 'otp/request') {
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    if (!email) return json({ message: 'Email is required' }, 400)
    const user = getCollection('users').find((u) => u.email === email)
    if (!user) return json({ message: 'User not found' }, 404)
    return json({
      message: 'OTP sent',
      email: user.email,
      demoOtp: DEMO_OTP,
      purpose: 'login',
    })
  }

  if (method === 'POST' && action === 'otp') {
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const code = body.code
    if (!email) return json({ message: 'Email is required' }, 400)
    if (code !== DEMO_OTP) return json({ message: 'Invalid OTP code' }, 400)
    const user = getCollection('users').find((u) => u.email === email)
    if (!user) return json({ message: 'User not found' }, 404)
    return json({ user: stripPassword(user), token: `mock-token-${user.id}` })
  }

  if (method === 'POST' && action === 'signup') {
    const name = typeof body.name === 'string' ? body.name : ''
    const organizationName = typeof body.organizationName === 'string' ? body.organizationName : ''
    const email = typeof body.email === 'string' ? body.email : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!name || !organizationName || !email || !password) {
      return json({ message: 'Missing required fields' }, 400)
    }
    if (getCollection('users').some((u) => u.email === email)) {
      return json({ message: 'Email already registered' }, 409)
    }
    const tenantId = String(Date.now())
    getCollection('tenants').push({
      id: tenantId,
      name: organizationName,
      slug: organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      plan: 'starter',
      status: 'active',
      usersCount: 1,
      createdAt: new Date().toISOString(),
    })
    const id = String(Date.now() + 1)
    const user: JsonRecord = {
      id,
      name,
      email,
      password,
      role: 'owner',
      tenantId,
      status: 'active',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    }
    getCollection('users').push(user)
    return json({ user: stripPassword(user), token: `mock-token-${id}` }, 201)
  }

  if (method === 'POST' && action === 'forgot-password') {
    const email = body.email
    if (!email) return json({ message: 'Email is required' }, 400)
    return json({
      message: 'If the email exists, a reset link was sent.',
      demoOtp: DEMO_OTP,
    })
  }

  if (method === 'POST' && action === 'change-password') {
    const email = typeof body.email === 'string' ? body.email : ''
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : ''
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''
    const user = getCollection('users').find(
      (u) => u.email === email && u.password === currentPassword,
    )
    if (!user) return json({ message: 'Current password is incorrect' }, 400)
    user.password = newPassword
    return json({ message: 'Password updated' })
  }

  return null
}

function handleMenuReorder(body: Record<string, unknown>): Response {
  const items = body.items
  if (!Array.isArray(items) || items.length === 0) {
    return json({ message: 'items array is required' }, 400)
  }

  const menu = getCollection('menu')

  for (const patch of items) {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch) || !('id' in patch)) {
      return json({ message: 'Each patch requires an id' }, 400)
    }
    const record = patch as Record<string, unknown>
    if (typeof record.order !== 'number' || Number.isNaN(record.order)) {
      return json({ message: `Invalid order for menu item ${String(record.id)}` }, 400)
    }
    const existing = menu.find((item) => String(item.id) === String(record.id))
    if (!existing) {
      return json({ message: `Menu item ${String(record.id)} not found` }, 404)
    }
    const parentId =
      record.parentId === undefined || record.parentId === null || record.parentId === ''
        ? null
        : String(record.parentId)
    if (parentId === String(record.id)) {
      return json({ message: 'A menu item cannot be its own parent' }, 400)
    }
    existing.parentId = parentId
    existing.order = record.order
  }

  return json(menu)
}

function handleCollection(
  method: string,
  collection: CollectionName,
  id: string | undefined,
  url: URL,
  body: Record<string, unknown>,
): Response {
  const items = getCollection(collection)

  if (!id) {
    if (method === 'GET') return json(applyListQuery(items, url))
    if (method === 'POST') {
      const created: JsonRecord = {
        ...body,
        id: typeof body.id === 'string' && body.id ? body.id : nextId(collection),
      }
      items.push(created)
      return json(created, 201)
    }
    return json({ message: 'Method not allowed' }, 405)
  }

  const index = items.findIndex((item) => String(item.id) === id)
  if (index < 0) return json({ message: 'Not found' }, 404)

  if (method === 'GET') return json(items[index])
  if (method === 'PUT') {
    const updated: JsonRecord = { ...body, id }
    items[index] = updated
    return json(updated)
  }
  if (method === 'PATCH') {
    items[index] = { ...items[index], ...body, id }
    return json(items[index])
  }
  if (method === 'DELETE') {
    items.splice(index, 1)
    return noContent()
  }
  return json({ message: 'Method not allowed' }, 405)
}

/** Handle `/api/*` mock routes (json-server + custom auth/search/menu). */
export async function handleApiRequest(request: Request, url: URL): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const pathname = url.pathname.startsWith(API_PREFIX)
    ? url.pathname.slice(API_PREFIX.length) || '/'
    : url.pathname

  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  if (parts.length === 0) {
    return json({
      name: 'ACP Admin mock API',
      demoOtp: DEMO_OTP,
      collections: [
        'users',
        'tenants',
        'roles',
        'permissions',
        'menu',
        'notifications',
        'settings',
        'dashboardStats',
      ],
    })
  }

  let body: Record<string, unknown> = {}
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'DELETE') {
    try {
      body = await readBody(request)
    } catch (error) {
      return json({ message: error instanceof Error ? error.message : 'Invalid body' }, 400)
    }
  }

  if (parts[0] === 'auth') {
    const authResponse = handleAuth(request.method, parts, body)
    if (authResponse) return authResponse
    return json({ message: 'Not found' }, 404)
  }

  if (parts[0] === 'search' && parts.length === 1 && request.method === 'GET') {
    return json(runHybridSearch(getDb(), url.searchParams.get('q') ?? ''))
  }

  if (parts[0] === 'menu' && parts[1] === 'reorder' && request.method === 'POST') {
    return handleMenuReorder(body)
  }

  if (isCollection(parts[0]) && parts.length <= 2) {
    return handleCollection(request.method, parts[0], parts[1], url, body)
  }

  return json({ message: 'Not found' }, 404)
}
