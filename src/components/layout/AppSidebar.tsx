'use client'

import {
  Building2,
  FormInput,
  KeyRound,
  LayoutDashboard,
  ListTree,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Type,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AcpLogo } from '@/components/brand/AcpLogo'
import { AppNavLink } from '@/components/navigation/AppNavLink'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import styles from '@/layouts/AppShell.module.css'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const primaryItems: NavItem[] = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/access/users', label: 'Users', icon: Users },
  { to: '/app/access/roles', label: 'Roles & Permissions', icon: KeyRound },
  { to: '/app/access/menu', label: 'Menu tree', icon: ListTree },
  { to: '/app/access/tenants', label: 'Tenants', icon: Building2 },
  { to: '/app/settings', label: 'Platform settings', icon: Settings },
]

const designSystemGroup: NavGroup = {
  label: 'Design System',
  items: [
    { to: '/app/design-system/typography', label: 'Typography', icon: Type },
    { to: '/app/design-system/forms', label: 'Forms', icon: FormInput },
  ],
}

type AppSidebarProps = {
  collapsed: boolean
  onToggleCollapsed: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  isDesktop: boolean
}

function renderNavLink(
  item: NavItem,
  showLabels: boolean,
  onMobileClose: () => void,
) {
  return (
    <AppNavLink
      key={item.to}
      href={item.to}
      end={item.end}
      onClick={onMobileClose}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          styles.navLink,
          isActive && styles.navLinkActive,
          !showLabels && styles.navLinkCollapsed,
        )
      }
      title={item.label}
    >
      <item.icon size={18} aria-hidden />
      {showLabels ? item.label : null}
    </AppNavLink>
  )
}

export function AppSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
  isDesktop,
}: AppSidebarProps) {
  if (typeof onToggleCollapsed !== 'function') {
    throw new Error('AppSidebar requires onToggleCollapsed')
  }
  if (typeof onMobileClose !== 'function') {
    throw new Error('AppSidebar requires onMobileClose')
  }

  const drawerVisible = isDesktop || mobileOpen
  // Mobile drawer is always expanded (labels visible); desktop respects collapse.
  const showLabels = !isDesktop || !collapsed
  const desktopCollapsed = isDesktop && collapsed

  // One toggle: desktop collapses rail; mobile closes the off-canvas drawer.
  const onToggle = () => {
    if (!isDesktop) {
      onMobileClose()
      return
    }
    onToggleCollapsed()
  }

  const CollapseIcon = desktopCollapsed ? PanelLeftOpen : PanelLeftClose
  const toggleLabel = !isDesktop
    ? 'Collapse menu'
    : desktopCollapsed
      ? 'Expand menu'
      : 'Collapse menu'

  return (
    <aside
      id="app-sidebar"
      className={cn(styles.sidebar, desktopCollapsed && styles.sidebarCollapsed)}
      aria-hidden={drawerVisible ? undefined : true}
      data-mobile-open={mobileOpen ? 'true' : 'false'}
      style={!drawerVisible ? { pointerEvents: 'none' } : undefined}
    >
      <div
        className={cn(
          styles.sidebarHeader,
          desktopCollapsed && styles.sidebarHeaderCollapsed,
        )}
      >
        <div className={styles.sidebarHeaderRow}>
          <AcpLogo
            className={cn(styles.sidebarLogo, showLabels && 'flex-1')}
            // Match nav icon box (18px) so the mark/icon column reads as one rhythm.
            markClassName="h-[18px] w-[18px] shrink-0"
            withWordmark={showLabels}
          />
          <Button
            variant="ghost"
            size="sm"
            className={styles.collapseToggle}
            onClick={onToggle}
            aria-label={toggleLabel}
            title={toggleLabel}
          >
            <CollapseIcon size={18} />
          </Button>
        </div>
      </div>
      <nav className={styles.sidebarNav} aria-label="Primary">
        {primaryItems.map((item) => renderNavLink(item, showLabels, onMobileClose))}

        <div className={styles.navGroup} role="group" aria-label={designSystemGroup.label}>
          {showLabels ? (
            <p className={styles.navGroupLabel}>{designSystemGroup.label}</p>
          ) : null}
          {designSystemGroup.items.map((item) =>
            renderNavLink(item, showLabels, onMobileClose),
          )}
        </div>
      </nav>
    </aside>
  )
}
