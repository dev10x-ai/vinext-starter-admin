import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppHeader } from '@/components/layout/AppHeader'
import { NotificationsDrawer } from '@/components/notifications/NotificationsDrawer'
import { Toaster } from '@/components/ui/Toaster'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useTenantsQuery } from '@/queries'
import { cn } from '@/lib/cn'

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const tenantId = useUiStore((s) => s.tenantId)
  const setTenantId = useUiStore((s) => s.setTenantId)
  const { data: tenants } = useTenantsQuery()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!tenants?.length) return
    if (!tenantId || !tenants.some((t) => t.id === tenantId)) {
      setTenantId(tenants[0].id)
    }
  }, [tenants, tenantId, setTenantId])

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <AppSidebar collapsed={collapsed} />
      <div className={cn('transition-[padding]', collapsed ? 'pl-[60px]' : 'pl-56')}>
        <AppHeader />
        <main className="p-4 md:p-6">
          <button
            type="button"
            className="mb-3 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? 'Expand menu' : 'Collapse menu'}
          </button>
          <Outlet />
        </main>
      </div>
      <NotificationsDrawer />
      <Toaster />
    </div>
  )
}
