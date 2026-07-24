'use client'

import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { AppNavLink } from '@/components/navigation/AppNavLink'
import { cn } from '@/lib/cn'

const links = [
  { href: '/app/settings/ai', label: 'AI providers' },
  { href: '/app/settings/email', label: 'Email providers' },
  { href: '/app/settings/third-party', label: 'Third-party APIs' },
  { href: '/app/settings/logs', label: 'Logs' },
]

export function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <PageHeader title="Platform settings" description="Configure providers and observability." />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {links.map((l) => (
            <AppNavLink
              key={l.href}
              href={l.href}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-accent)]',
                  isActive && 'bg-[var(--color-accent)] font-medium text-[var(--color-primary)]',
                )
              }
            >
              {l.label}
            </AppNavLink>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}
