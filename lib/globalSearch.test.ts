import { describe, expect, it } from 'vitest'
import {
  filterAndRankSearchResults,
  flattenSearchGroups,
  groupSearchResults,
  scoreMatch,
  type SearchResult,
} from './globalSearch'

const candidates: Array<SearchResult & { fields: string[] }> = [
  {
    type: 'user',
    id: '1',
    title: 'Alex Admin',
    subtitle: 'admin@acp.local',
    url: '/app/access/users/1/edit',
    fields: ['Alex Admin', 'admin@acp.local', 'owner', '1'],
  },
  {
    type: 'user',
    id: '2',
    title: 'Sam Operator',
    subtitle: 'sam@acp.local',
    url: '/app/access/users/2/edit',
    fields: ['Sam Operator', 'sam@acp.local', 'operator', '2'],
  },
  {
    type: 'tenant',
    id: '1',
    title: 'ACP Demo',
    subtitle: 'acp-demo · enterprise',
    url: '/app/access/tenants/1/edit',
    fields: ['ACP Demo', 'acp-demo', 'enterprise', '1'],
  },
  {
    type: 'setting',
    id: 'ai',
    title: 'AI settings',
    subtitle: 'Providers, models, and API keys',
    url: '/app/settings/ai',
    fields: ['AI settings', 'Providers, models, and API keys', 'ai', 'anthropic', 'openai'],
  },
  {
    type: 'setting',
    id: 'email',
    title: 'Email settings',
    subtitle: 'SMTP and transactional email',
    url: '/app/settings/email',
    fields: ['Email settings', 'SMTP and transactional email', 'email', 'smtp'],
  },
]

describe('scoreMatch', () => {
  it('ranks exact > token > prefix, and ignores short substring noise', () => {
    expect(scoreMatch('ai', ['ai'])).toBeGreaterThan(scoreMatch('ai', ['ai settings']))
    expect(scoreMatch('ai', ['ai settings'])).toBeGreaterThan(0)
    expect(scoreMatch('ai', ['email'])).toBe(0)
    expect(scoreMatch('demo', ['acp-demo'])).toBeGreaterThan(0)
    expect(scoreMatch('zzz', ['alex'])).toBe(0)
  })

  it('fails fast on invalid input', () => {
    expect(() => scoreMatch(null as unknown as string, [])).toThrow(/query must be a string/)
    expect(() => scoreMatch('a', null as unknown as string[])).toThrow(/fields must be an array/)
  })
})

describe('filterAndRankSearchResults', () => {
  it('returns users matching name before weaker hits', () => {
    const results = filterAndRankSearchResults('alex', candidates)
    expect(results[0]?.type).toBe('user')
    expect(results[0]?.title).toBe('Alex Admin')
    expect(results.map((r) => r.id)).not.toContain('email')
  })

  it('finds settings by keyword', () => {
    const results = filterAndRankSearchResults('smtp', candidates)
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ type: 'setting', id: 'email', url: '/app/settings/email' })
  })

  it('finds tenants by slug fragment', () => {
    const results = filterAndRankSearchResults('demo', candidates)
    expect(results.some((r) => r.type === 'tenant' && r.id === '1')).toBe(true)
  })
})

describe('groupSearchResults', () => {
  it('groups in Users / Tenants / Settings order', () => {
    const flat: SearchResult[] = [
      candidates[3]!,
      candidates[0]!,
      candidates[2]!,
      candidates[4]!,
    ].map(({ fields: _f, ...item }) => item)

    const groups = groupSearchResults(flat)
    expect(groups.map((g) => g.label)).toEqual(['Users', 'Tenants', 'Settings'])
    expect(groups[0]?.items[0]?.title).toBe('Alex Admin')
    expect(flattenSearchGroups(groups)).toHaveLength(4)
  })

  it('rejects invalid urls', () => {
    expect(() =>
      groupSearchResults([
        { type: 'user', id: '1', title: 'Bad', url: 'https://evil.example' },
      ]),
    ).toThrow(/Invalid search result url/)
  })
})
