export type User = {
  id: string
  name: string
  email: string
  role: string
  tenantId: string
  status: 'active' | 'inactive' | string
  twoFactorEnabled: boolean
  createdAt: string
  password?: string
}

export type Tenant = {
  id: string
  name: string
  slug: string
  plan: string
  status: string
  usersCount: number
  createdAt: string
}

export type Role = {
  id: string
  name: string
  key: string
  description: string
  permissions: string[]
}

export type Permission = {
  id: string
  key: string
  label: string
  group: string
}

export type MenuItem = {
  id: string
  label: string
  path: string | null
  icon: string
  parentId: string | null
  order: number
  enabled: boolean
}

export type AppNotification = {
  id: string
  title: string
  body: string
  read: boolean
  createdAt: string
}

export type DashboardStat = {
  id: string
  label: string
  value: number
  delta: number
  series: number[]
}

export type ThemeId = 'default' | 'ruby' | 'emerald'
export type ColorMode = 'light' | 'dark' | 'system'
