'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppHeader } from '@/components/layout/AppHeader'
import { NotificationsDrawer } from '@/components/notifications/NotificationsDrawer'
import { ClientRedirect } from '@/components/navigation/ClientRedirect'
import { Toaster } from '@/components/ui/Toaster'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useTenantsQuery } from '@/queries'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import styles from './AppShell.module.css'

function useAuthHydrated() {
  // Always start false so SSR and the first client paint match (Zustand persist
  // is not available/hydrated during RSC/SSR).
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const persistApi = useAuthStore.persist
    if (!persistApi?.hasHydrated || !persistApi.onFinishHydration) {
      setHydrated(true)
      return
    }
    if (persistApi.hasHydrated()) {
      setHydrated(true)
      return
    }
    return persistApi.onFinishHydration(() => setHydrated(true))
  }, [])

  return hydrated
}

/** Client auth-guard + shell. Auth stays in Zustand persist — no cookie/server session. */
export function AppLayout({ children }: { children: ReactNode }) {
  const hydrated = useAuthHydrated()
  const user = useAuthStore((s) => s.user)
  const tenantId = useUiStore((s) => s.tenantId)
  const setTenantId = useUiStore((s) => s.setTenantId)
  const { data: tenants } = useTenantsQuery()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const isDesktop = useIsDesktop()
  const pathname = usePathname()

  useEffect(() => {
    if (!tenants?.length) return
    if (!tenantId || !tenants.some((t) => t.id === tenantId)) {
      setTenantId(tenants[0].id)
    }
  }, [tenants, tenantId, setTenantId])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

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

  if (!hydrated) return null
  if (!user) return <ClientRedirect href="/login" />

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
        <main className={styles.main}>{children}</main>
      </div>
      <NotificationsDrawer />
      <Toaster />
    </div>
  )
}
