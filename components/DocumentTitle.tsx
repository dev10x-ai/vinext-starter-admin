'use client'

import { usePathname } from 'next/navigation'
import { usePageTitle } from '@/hooks/usePageTitle'
import { resolvePageTitle } from '@/lib/pageTitle'

/** Syncs `document.title` from the current route pathname. */
export function DocumentTitle() {
  const pathname = usePathname() ?? '/'
  usePageTitle(resolvePageTitle(pathname), { formatted: true })
  return null
}
