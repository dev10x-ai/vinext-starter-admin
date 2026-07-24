'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type AppNavLinkProps = Omit<ComponentProps<typeof Link>, 'href' | 'className'> & {
  href: string
  end?: boolean
  className?: string | ((state: { isActive: boolean }) => string)
  children: ReactNode
}

function pathMatches(pathname: string, href: string, end: boolean): boolean {
  if (end) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Active-aware link (React Router NavLink equivalent for App Router). */
export function AppNavLink({
  href,
  end = false,
  className,
  children,
  ...rest
}: AppNavLinkProps) {
  if (typeof href !== 'string' || !href.startsWith('/')) {
    throw new Error('AppNavLink href must be an absolute path starting with /')
  }

  const pathname = usePathname() ?? '/'
  const isActive = pathMatches(pathname, href, end)
  const resolvedClassName =
    typeof className === 'function' ? className({ isActive }) : className

  return (
    <Link href={href} className={cn(resolvedClassName)} {...rest}>
      {children}
    </Link>
  )
}
