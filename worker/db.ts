import seed from '../mock/db.json'

export type JsonRecord = Record<string, unknown> & { id: string }

export type MockDb = {
  users: JsonRecord[]
  tenants: JsonRecord[]
  roles: JsonRecord[]
  permissions: JsonRecord[]
  menu: JsonRecord[]
  notifications: JsonRecord[]
  settings: JsonRecord[]
  dashboardStats: JsonRecord[]
}

export const COLLECTIONS = [
  'users',
  'tenants',
  'roles',
  'permissions',
  'menu',
  'notifications',
  'settings',
  'dashboardStats',
] as const

export type CollectionName = (typeof COLLECTIONS)[number]

function cloneSeed(): MockDb {
  return structuredClone(seed) as MockDb
}

let db: MockDb = cloneSeed()

export function getDb(): MockDb {
  return db
}

export function resetDb(): void {
  db = cloneSeed()
}

export function isCollection(name: string): name is CollectionName {
  return (COLLECTIONS as readonly string[]).includes(name)
}

export function getCollection(name: CollectionName): JsonRecord[] {
  return db[name]
}

export function findById(name: CollectionName, id: string): JsonRecord | undefined {
  return getCollection(name).find((item) => String(item.id) === id)
}

export function nextId(name: CollectionName): string {
  const numeric = getCollection(name)
    .map((item) => Number(item.id))
    .filter((n) => Number.isFinite(n))
  const max = numeric.length > 0 ? Math.max(...numeric) : 0
  return String(max + 1)
}
