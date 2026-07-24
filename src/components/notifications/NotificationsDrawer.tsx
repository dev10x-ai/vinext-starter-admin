import { X } from 'lucide-react'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/Button'
import { useUiStore } from '@/store/ui'
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from '@/queries'

export function NotificationsDrawer() {
  const notificationsOpen = useUiStore((s) => s.notificationsOpen)
  const setNotificationsOpen = useUiStore((s) => s.setNotificationsOpen)
  const { data: notifications = [] } = useNotificationsQuery()
  const markRead = useMarkNotificationReadMutation()
  const markAllRead = useMarkAllNotificationsReadMutation()

  if (!notificationsOpen) return null

  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setNotificationsOpen(false)}>
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-[var(--color-divider)] bg-[var(--color-surface)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-divider)] px-4 py-3">
          <h2 className="font-semibold">Notifications</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={unreadIds.length === 0 || markAllRead.isPending}
              onClick={() => void markAllRead.mutateAsync(unreadIds)}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationsOpen(false)}
              aria-label="Close notifications"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-[var(--color-text-muted)]">No notifications</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-md border border-[var(--color-divider)] p-3 ${n.read ? 'opacity-70' : 'bg-[var(--color-accent)]'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{n.body}</p>
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        {dayjs(n.createdAt).format('MMM D, HH:mm')}
                      </p>
                    </div>
                    {!n.read ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={markRead.isPending}
                        onClick={() => void markRead.mutateAsync(n.id)}
                      >
                        Mark read
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  )
}
