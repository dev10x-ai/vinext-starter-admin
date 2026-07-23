import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import {
  Building2,
  KeyRound,
  LayoutDashboard,
  ListTree,
  Settings,
  Shield,
  Users,
} from 'lucide-react'

const items = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/access/users', label: 'Users', icon: Users },
  { to: '/app/access/roles', label: 'Roles & Permissions', icon: KeyRound },
  { to: '/app/access/menu', label: 'Menu tree', icon: ListTree },
  { to: '/app/access/tenants', label: 'Tenants', icon: Building2 },
  { to: '/app/settings', label: 'Platform settings', icon: Settings },
]

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[var(--color-divider)] bg-[var(--color-surface)] transition-[width]',
        collapsed ? 'w-[60px]' : 'w-56',
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-[var(--color-divider)] px-3">
        <Shield className="text-[var(--color-primary)]" size={20} />
        {!collapsed ? <span className="font-[family-name:var(--font-display)] font-semibold">ACP</span> : null}
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)]',
                isActive && 'bg-[var(--color-accent)] font-medium text-[var(--color-primary)]',
              )
            }
            title={item.label}
          >
            <item.icon size={18} />
            {!collapsed ? item.label : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
