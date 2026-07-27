import { useEffect, useState } from 'react'

function getMatches(query: string): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(query).matches
}

/**
 * Subscribes to a CSS media query. Initializes synchronously in the browser
 * (Vite SPA) so the app shell does not flash the mobile layout on desktop.
 */
export function useMediaQuery(query: string): boolean {
  if (!query || typeof query !== 'string') {
    throw new Error('useMediaQuery requires a non-empty media query string')
  }

  const [matches, setMatches] = useState(() => getMatches(query))

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Matches Tailwind `md` and Macro Wallets mobile/desktop split (768px). */
export const DESKTOP_MEDIA_QUERY = '(min-width: 768px)'

export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_MEDIA_QUERY)
}
