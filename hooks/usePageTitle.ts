import { useEffect } from 'react'
import { formatPageTitle } from '@/lib/pageTitle'

/**
 * Sets `document.title` for the current view.
 * Pass a page label (e.g. "Users") or a full title already formatted.
 * When `pageTitle` is null/undefined/empty, uses `ACP Admin` alone.
 */
export function usePageTitle(pageTitle?: string | null, options?: { formatted?: boolean }) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const next =
      options?.formatted && typeof pageTitle === 'string' && pageTitle.trim() !== ''
        ? pageTitle.trim()
        : formatPageTitle(pageTitle)

    document.title = next
  }, [pageTitle, options?.formatted])
}
