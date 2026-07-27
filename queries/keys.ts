export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  tenants: ['tenants'] as const,
  tenant: (id: string) => ['tenants', id] as const,
  roles: ['roles'] as const,
  permissions: ['permissions'] as const,
  menu: ['menu'] as const,
  notifications: ['notifications'] as const,
  dashboardStats: ['dashboardStats'] as const,
  settings: (id: string) => ['settings', id] as const,
  search: (q: string) => ['search', q] as const,
}
