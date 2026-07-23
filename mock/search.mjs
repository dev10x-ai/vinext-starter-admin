/** Hybrid global search for the mock API (users, tenants, settings). */

export const SETTINGS_ENTRIES = [
  {
    id: 'ai',
    title: 'AI settings',
    subtitle: 'Providers, models, and API keys',
    url: '/app/settings/ai',
    keywords: ['ai', 'anthropic', 'openai', 'model', 'llm'],
  },
  {
    id: 'email',
    title: 'Email settings',
    subtitle: 'SMTP and transactional email',
    url: '/app/settings/email',
    keywords: ['email', 'smtp', 'mail', 'sendgrid'],
  },
  {
    id: 'third-party',
    title: 'Third-party settings',
    subtitle: 'Integrations and external providers',
    url: '/app/settings/third-party',
    keywords: ['third', 'party', 'integration', 'webhook', 'oauth'],
  },
  {
    id: 'logs',
    title: 'Logs & observability',
    subtitle: 'Log drains and diagnostics',
    url: '/app/settings/logs',
    keywords: ['logs', 'observability', 'tracing', 'diagnostics'],
  },
]

const TYPE_ORDER = { user: 0, tenant: 1, setting: 2 }
const MAX_RESULTS = 24
const SUGGESTION_LIMIT = 8

/**
 * @param {string} query
 * @param {string[]} fields
 */
export function scoreMatch(query, fields) {
  const q = typeof query === 'string' ? query.trim().toLowerCase() : ''
  if (!q) return 0

  let best = 0
  for (const field of fields) {
    if (typeof field !== 'string' || !field) continue
    const value = field.toLowerCase()
    if (value === q) {
      best = Math.max(best, 100)
      continue
    }
    if (value.startsWith(q)) {
      best = Math.max(best, 80)
      continue
    }
    if (value.includes(q)) {
      best = Math.max(best, 60)
      continue
    }
    const tokens = value.split(/[^a-z0-9]+/).filter(Boolean)
    if (tokens.some((token) => token.startsWith(q))) {
      best = Math.max(best, 50)
    }
  }
  return best
}

/**
 * @param {{ users?: unknown[], tenants?: unknown[] }} db
 */
export function buildSearchCandidates(db) {
  if (!db || typeof db !== 'object') {
    throw new Error('db is required')
  }

  const users = Array.isArray(db.users) ? db.users : []
  const tenants = Array.isArray(db.tenants) ? db.tenants : []

  /** @type {Array<{ type: string, id: string, title: string, subtitle?: string, url: string, fields: string[] }>} */
  const candidates = []

  for (const user of users) {
    if (!user || typeof user !== 'object' || user.id == null) continue
    const id = String(user.id)
    const name = typeof user.name === 'string' ? user.name : ''
    const email = typeof user.email === 'string' ? user.email : ''
    const role = typeof user.role === 'string' ? user.role : ''
    candidates.push({
      type: 'user',
      id,
      title: name || email || `User ${id}`,
      subtitle: email || role || undefined,
      url: `/app/access/users/${id}/edit`,
      fields: [name, email, role, id],
    })
  }

  for (const tenant of tenants) {
    if (!tenant || typeof tenant !== 'object' || tenant.id == null) continue
    const id = String(tenant.id)
    const name = typeof tenant.name === 'string' ? tenant.name : ''
    const slug = typeof tenant.slug === 'string' ? tenant.slug : ''
    const plan = typeof tenant.plan === 'string' ? tenant.plan : ''
    candidates.push({
      type: 'tenant',
      id,
      title: name || slug || `Tenant ${id}`,
      subtitle: slug ? `${slug}${plan ? ` · ${plan}` : ''}` : plan || undefined,
      url: `/app/access/tenants/${id}/edit`,
      fields: [name, slug, plan, id],
    })
  }

  for (const setting of SETTINGS_ENTRIES) {
    candidates.push({
      type: 'setting',
      id: setting.id,
      title: setting.title,
      subtitle: setting.subtitle,
      url: setting.url,
      fields: [setting.title, setting.subtitle, setting.id, ...setting.keywords],
    })
  }

  return candidates
}

/**
 * @param {Array<{ type: string, id: string, title: string, subtitle?: string, url: string, fields: string[], score?: number }>} results
 */
export function rankSearchResults(results) {
  if (!Array.isArray(results)) {
    throw new Error('results must be an array')
  }
  return [...results].sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0)
    if (scoreDiff !== 0) return scoreDiff
    const typeDiff = (TYPE_ORDER[a.type] ?? 99) - (TYPE_ORDER[b.type] ?? 99)
    if (typeDiff !== 0) return typeDiff
    return String(a.title).localeCompare(String(b.title))
  })
}

/**
 * @param {{ users?: unknown[], tenants?: unknown[] }} db
 * @param {string} [query]
 */
export function runHybridSearch(db, query = '') {
  const q = typeof query === 'string' ? query.trim() : ''
  const candidates = buildSearchCandidates(db)

  if (!q) {
    const suggestions = [
      ...candidates.filter((c) => c.type === 'setting').slice(0, 4),
      ...candidates.filter((c) => c.type === 'user').slice(0, 2),
      ...candidates.filter((c) => c.type === 'tenant').slice(0, 2),
    ].slice(0, SUGGESTION_LIMIT)

    return {
      query: '',
      results: suggestions.map(({ fields: _fields, score: _score, ...item }) => item),
    }
  }

  const scored = []
  for (const candidate of candidates) {
    const score = scoreMatch(q, candidate.fields)
    if (score <= 0) continue
    scored.push({ ...candidate, score })
  }

  const ranked = rankSearchResults(scored).slice(0, MAX_RESULTS)
  return {
    query: q,
    results: ranked.map(({ fields: _fields, score: _score, ...item }) => item),
  }
}
