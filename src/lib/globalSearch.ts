export type SearchResultType = 'user' | 'tenant' | 'setting'

export type SearchResult = {
  type: SearchResultType
  id: string
  title: string
  subtitle?: string
  url: string
}

export type SearchResponse = {
  query: string
  results: SearchResult[]
}

export type SearchResultGroup = {
  type: SearchResultType
  label: string
  items: SearchResult[]
}

export const SEARCH_GROUP_ORDER: SearchResultType[] = ['user', 'tenant', 'setting']

export const SEARCH_GROUP_LABELS: Record<SearchResultType, string> = {
  user: 'Users',
  tenant: 'Tenants',
  setting: 'Settings',
}

const TYPE_ORDER: Record<SearchResultType, number> = {
  user: 0,
  tenant: 1,
  setting: 2,
}

/** Score a query against searchable fields (higher is better). */
export function scoreMatch(query: string, fields: Array<string | null | undefined>): number {
  if (typeof query !== 'string') {
    throw new Error('query must be a string')
  }
  if (!Array.isArray(fields)) {
    throw new Error('fields must be an array')
  }

  const q = query.trim().toLowerCase()
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

type Rankable = SearchResult & { score?: number; fields?: string[] }

/** Rank hybrid results by score, then type, then title. */
export function rankSearchResults<T extends Rankable>(results: T[]): T[] {
  if (!Array.isArray(results)) {
    throw new Error('results must be an array')
  }
  return [...results].sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0)
    if (scoreDiff !== 0) return scoreDiff
    const typeDiff = (TYPE_ORDER[a.type] ?? 99) - (TYPE_ORDER[b.type] ?? 99)
    if (typeDiff !== 0) return typeDiff
    return a.title.localeCompare(b.title)
  })
}

/** Filter + rank candidate results for a query (pure helper for tests / client). */
export function filterAndRankSearchResults(
  query: string,
  candidates: Array<SearchResult & { fields: string[] }>,
): SearchResult[] {
  if (typeof query !== 'string') {
    throw new Error('query must be a string')
  }
  if (!Array.isArray(candidates)) {
    throw new Error('candidates must be an array')
  }

  const q = query.trim()
  if (!q) {
    return candidates.map(({ fields: _fields, ...item }) => item)
  }

  const scored: Rankable[] = []
  for (const candidate of candidates) {
    const score = scoreMatch(q, candidate.fields)
    if (score <= 0) continue
    scored.push({ ...candidate, score })
  }

  return rankSearchResults(scored).map(({ fields: _fields, score: _score, ...item }) => item)
}

/** Group flat API results for palette sections. */
export function groupSearchResults(results: SearchResult[]): SearchResultGroup[] {
  if (!Array.isArray(results)) {
    throw new Error('results must be an array')
  }

  const buckets: Record<SearchResultType, SearchResult[]> = {
    user: [],
    tenant: [],
    setting: [],
  }

  for (const result of results) {
    if (!result || typeof result !== 'object') continue
    if (!SEARCH_GROUP_ORDER.includes(result.type)) continue
    if (typeof result.url !== 'string' || !result.url.startsWith('/')) {
      throw new Error(`Invalid search result url for ${result.id}`)
    }
    buckets[result.type].push(result)
  }

  return SEARCH_GROUP_ORDER.filter((type) => buckets[type].length > 0).map((type) => ({
    type,
    label: SEARCH_GROUP_LABELS[type],
    items: buckets[type],
  }))
}

/** Flatten grouped results for keyboard navigation. */
export function flattenSearchGroups(groups: SearchResultGroup[]): SearchResult[] {
  if (!Array.isArray(groups)) {
    throw new Error('groups must be an array')
  }
  return groups.flatMap((group) => group.items)
}
