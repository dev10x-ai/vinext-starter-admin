import { useLocation } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { resolvePageTitle } from '@/lib/pageTitle'

/** Syncs `document.title` from the current route pathname. */
export function DocumentTitle() {
  const { pathname } = useLocation()
  usePageTitle(resolvePageTitle(pathname), { formatted: true })
  return null
}
