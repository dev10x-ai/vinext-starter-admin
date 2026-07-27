import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type TablePrefs = {
  pageSize: number
}

type UiState = {
  tenantId: string | null
  notificationsOpen: boolean
  globalSearch: string
  tablePrefs: TablePrefs
  setTenantId: (id: string) => void
  setGlobalSearch: (q: string) => void
  setNotificationsOpen: (open: boolean) => void
  setTablePageSize: (size: number) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      tenantId: '1',
      notificationsOpen: false,
      globalSearch: '',
      tablePrefs: { pageSize: 10 },
      setTenantId(id) {
        if (!id) throw new Error('tenantId is required')
        set({ tenantId: id })
      },
      setGlobalSearch(q) {
        set({ globalSearch: q })
      },
      setNotificationsOpen(open) {
        set({ notificationsOpen: open })
      },
      setTablePageSize(size) {
        if (!Number.isFinite(size) || size < 1) {
          throw new Error('pageSize must be a positive number')
        }
        set((s) => ({ tablePrefs: { ...s.tablePrefs, pageSize: size } }))
      },
    }),
    {
      name: 'acp-ui',
      partialize: (s) => ({ tenantId: s.tenantId, tablePrefs: s.tablePrefs }),
    },
  ),
)
