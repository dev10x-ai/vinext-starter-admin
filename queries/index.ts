import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  AppNotification,
  DashboardStat,
  MenuItem,
  Permission,
  Role,
  Tenant,
  User,
} from '@/types'
import type { SearchResponse } from '@/lib/globalSearch'
import { queryKeys } from './keys'

export { queryKeys }

export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => api.get<User[]>('/users'),
  })
}

export function useUserQuery(id: string | null | undefined) {
  const userId = typeof id === 'string' ? id.trim() : ''
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => api.get<User>(`/users/${userId}`),
    enabled: userId.length > 0,
  })
}

export function useCreateUserMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post<User>('/users', body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.users }),
  })
}

export function useUpdateUserMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      api.patch<User>(`/users/${id}`, body),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.users })
      void qc.invalidateQueries({ queryKey: queryKeys.user(id) })
    },
  })
}

export function useDeleteUserMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.users }),
  })
}

export function useTenantsQuery() {
  return useQuery({
    queryKey: queryKeys.tenants,
    queryFn: () => api.get<Tenant[]>('/tenants'),
  })
}

export function useTenantQuery(id: string | null | undefined) {
  const tenantId = typeof id === 'string' ? id.trim() : ''
  return useQuery({
    queryKey: queryKeys.tenant(tenantId),
    queryFn: () => api.get<Tenant>(`/tenants/${tenantId}`),
    enabled: tenantId.length > 0,
  })
}

export function useCreateTenantMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post<Tenant>('/tenants', body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.tenants }),
  })
}

export function useUpdateTenantMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      api.patch<Tenant>(`/tenants/${id}`, body),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.tenants })
      void qc.invalidateQueries({ queryKey: queryKeys.tenant(id) })
    },
  })
}

export function useDeleteTenantMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tenants/${id}`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.tenants }),
  })
}

export function useRolesQuery() {
  return useQuery({
    queryKey: queryKeys.roles,
    queryFn: () => api.get<Role[]>('/roles'),
  })
}

export function usePermissionsQuery() {
  return useQuery({
    queryKey: queryKeys.permissions,
    queryFn: () => api.get<Permission[]>('/permissions'),
  })
}

export function useUpdateRoleMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Role> }) =>
      api.patch<Role>(`/roles/${id}`, body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.roles }),
  })
}

export function useMenuQuery() {
  return useQuery({
    queryKey: queryKeys.menu,
    queryFn: async () => {
      const data = await api.get<MenuItem[]>('/menu')
      return data.sort((a, b) => a.order - b.order)
    },
  })
}

export function useUpdateMenuItemMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<MenuItem> }) =>
      api.patch<MenuItem>(`/menu/${id}`, body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.menu }),
  })
}

export type MenuReorderPatch = {
  id: string
  parentId: string | null
  order: number
}

export function useReorderMenuMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (items: MenuReorderPatch[]) => {
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Reorder payload must be a non-empty items array')
      }
      return api.post<MenuItem[]>('/menu/reorder', { items })
    },
    onSuccess: (data) => {
      qc.setQueryData(
        queryKeys.menu,
        [...data].sort((a, b) => a.order - b.order),
      )
      void qc.invalidateQueries({ queryKey: queryKeys.menu })
    },
  })
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => api.get<AppNotification[]>('/notifications?_sort=createdAt&_order=desc'),
  })
}

export function useMarkNotificationReadMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}`, { read: true }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  })
}

export function useMarkAllNotificationsReadMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (unreadIds: string[]) => {
      await Promise.all(unreadIds.map((id) => api.patch(`/notifications/${id}`, { read: true })))
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  })
}

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => api.get<DashboardStat[]>('/dashboardStats'),
  })
}

export function useSearchQuery(query: string, enabled = true) {
  const q = typeof query === 'string' ? query.trim() : ''
  return useQuery({
    queryKey: queryKeys.search(q),
    queryFn: () => {
      const path = q ? `/search?q=${encodeURIComponent(q)}` : '/search'
      return api.get<SearchResponse>(path)
    },
    enabled,
    staleTime: 30_000,
  })
}

export type SettingRecord = Record<string, unknown> & { id: string; category: string }

export function useSettingQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.settings(id),
    queryFn: () => api.get<SettingRecord>(`/settings/${id}`),
  })
}

export function useUpdateSettingMutation(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: SettingRecord) => api.put<SettingRecord>(`/settings/${id}`, body),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.settings(id), data)
    },
  })
}
