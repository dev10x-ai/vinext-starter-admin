/** Hybrid global search — Workers port of mock/search.mjs */

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
  {
    id: 'typography',
    title: 'Typography',
    subtitle: 'Design system text elements',
    url: '/app/design-system/typography',
    keywords: ['typography', 'prose', 'headings', 'design system', 'text'],
  },
] as const

const TYPE_ORDER: Record<string, number> = { user: 0, tenant: 1, setting: 2 }
const MAX_RESULTS = 24
const SUGGESTION_LIMIT = 8

export function scoreMatch(query: string, fields: string[]) {
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
    const tokens = value.split(/[^a-z0-9]+/).filter(Boolean)
    if (tokens.some((token) => token === q)) {
      best = Math.max(best, 75)
      continue
    }
    if (tokens.some((token) => token.startsWith(q))) {
      best = Math.max(best, 50)
      continue
    }
    if (q.length > 2 && value.includes(q)) {
      best = Math.max(best, 60)
    }
  }
  return best
}

type DbLike = { users?: unknown[]; tenants?: unknown[] }

type SearchCandidate = {
  type: string
  id: string
  title: string
  subtitle?: string
  url: string
  fields: string[]
  score?: number
}

export function buildSearchCandidates(db: DbLike) {
  if (!db || typeof db !== 'object') {
    throw new Error('db is required')
  }

  const users = Array.isArray(db.users) ? db.users : []
  const tenants = Array.isArray(db.tenants) ? db.tenants : []
  const candidates: SearchCandidate[] = []

  for (const user of users) {
    if (!user || typeof user !== 'object' || !('id' in user) || user.id == null) continue
    const record = user as Record<string, unknown>
    const id = String(record.id)
    const name = typeof record.name === 'string' ? record.name : ''
    const email = typeof record.email === 'string' ? record.email : ''
    const role = typeof record.role === 'string' ? record.role : ''
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
    if (!tenant || typeof tenant !== 'object' || !('id' in tenant) || tenant.id == null) continue
    const record = tenant as Record<string, unknown>
    const id = String(record.id)
    const name = typeof record.name === 'string' ? record.name : ''
    const slug = typeof record.slug === 'string' ? record.slug : ''
    const plan = typeof record.plan === 'string' ? record.plan : ''
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

export function rankSearchResults(results: SearchCandidate[]) {
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

export function runHybridSearch(db: DbLike, query = '') {
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

  const scored: SearchCandidate[] = []
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
