import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppHeader } from '@/components/layout/AppHeader'
import { NotificationsDrawer } from '@/components/notifications/NotificationsDrawer'
import { Toaster } from '@/components/ui/Toaster'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useTenantsQuery } from '@/queries'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import styles from './AppShell.module.css'

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const tenantId = useUiStore((s) => s.tenantId)
  const setTenantId = useUiStore((s) => s.setTenantId)
  const { data: tenants } = useTenantsQuery()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const isDesktop = useIsDesktop()
  const location = useLocation()

  useEffect(() => {
    if (!tenants?.length) return
    if (!tenantId || !tenants.some((t) => t.id === tenantId)) {
      setTenantId(tenants[0].id)
    }
  }, [tenants, tenantId, setTenantId])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false)
  }, [isDesktop])

  useEffect(() => {
    if (!mobileNavOpen || isDesktop) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileNavOpen, isDesktop])

  useEffect(() => {
    if (!mobileNavOpen || isDesktop) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileNavOpen, isDesktop])

  if (!user) return <Navigate to="/login" replace />

  const desktopCollapsed = isDesktop && collapsed

  return (
    <div
      className={styles.shell}
      data-collapsed={desktopCollapsed ? 'true' : 'false'}
    >
      <div
        className={cn(styles.overlay, mobileNavOpen && styles.overlayVisible)}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden={!mobileNavOpen}
      />
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
        isDesktop={isDesktop}
      />
      <div
        className={cn(
          styles.content,
          desktopCollapsed ? styles.contentCollapsed : styles.contentExpanded,
        )}
      >
        <AppHeader
          mobileNavOpen={mobileNavOpen}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <NotificationsDrawer />
      <Toaster />
    </div>
  )
}
