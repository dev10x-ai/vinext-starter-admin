import { NavLink, Outlet } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/cn'

const links = [
  { to: '/app/settings/ai', label: 'AI providers' },
  { to: '/app/settings/email', label: 'Email providers' },
  { to: '/app/settings/third-party', label: 'Third-party APIs' },
  { to: '/app/settings/logs', label: 'Logs' },
]

export function SettingsLayout() {
  return (
    <div>
      <PageHeader title="Platform settings" description="Configure providers and observability." />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-accent)]',
                  isActive && 'bg-[var(--color-accent)] font-medium text-[var(--color-primary)]',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </div>
    </div>
  )
}
