import { Bell, Menu } from 'lucide-react'
import { useUiStore } from '@/store/ui'
import { useNotificationsQuery } from '@/queries'
import { TenantSwitcher } from '@/components/layout/TenantSwitcher'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import { UserMenu } from '@/components/layout/UserMenu'
import styles from '@/layouts/AppShell.module.css'

type AppHeaderProps = {
  mobileNavOpen: boolean
  onOpenMobileNav: () => void
}

export function AppHeader({ mobileNavOpen, onOpenMobileNav }: AppHeaderProps) {
  if (typeof onOpenMobileNav !== 'function') {
    throw new Error('AppHeader requires onOpenMobileNav')
  }

  const setNotificationsOpen = useUiStore((s) => s.setNotificationsOpen)
  const { data: notifications = [] } = useNotificationsQuery()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className={styles.header}>
      <div className={styles.headerLeading}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          aria-controls="app-sidebar"
          aria-expanded={mobileNavOpen}
        >
          <Menu size={20} aria-hidden />
        </button>
        <TenantSwitcher />
        <GlobalSearch />
      </div>

      <div className={styles.headerActions}>
        <button
          type="button"
          onClick={() => setNotificationsOpen(true)}
          className={`relative ${styles.iconTap}`}
          aria-label="Notifications"
        >
          <Bell size={18} aria-hidden />
          {unread > 0 ? (
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[var(--color-danger)]" />
          ) : null}
        </button>

        <UserMenu />
      </div>
    </header>
  )
}
