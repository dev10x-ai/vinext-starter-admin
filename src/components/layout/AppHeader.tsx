import { Bell } from 'lucide-react'
import { useUiStore } from '@/store/ui'
import { useNotificationsQuery } from '@/queries'
import { TenantSwitcher } from '@/components/layout/TenantSwitcher'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import { UserMenu } from '@/components/layout/UserMenu'

export function AppHeader() {
  const setNotificationsOpen = useUiStore((s) => s.setNotificationsOpen)
  const { data: notifications = [] } = useNotificationsQuery()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-divider)] bg-[var(--color-surface)] px-4">
      <TenantSwitcher />
      <GlobalSearch />

      <button
        type="button"
        onClick={() => setNotificationsOpen(true)}
        className="relative rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)]"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 ? (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-danger)]" />
        ) : null}
      </button>

      <UserMenu />
    </header>
  )
}
