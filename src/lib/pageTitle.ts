export const APP_TITLE = 'ACP Admin'

/** Exact pathname → page label. `null` means title is just APP_TITLE. */
export const ROUTE_PAGE_TITLES: Record<string, string | null> = {
  '/': null,
  '/login': 'Login',
  '/signup': 'Sign up',
  '/forgot-password': 'Forgot password',
  '/otp': 'Verify code',
  '/change-password': 'Change password',
  '/app': 'Dashboard',
  '/app/access/users': 'Users',
  '/app/access/users/new': 'New user',
  '/app/access/roles': 'Roles',
  '/app/access/menu': 'Menu',
  '/app/access/tenants': 'Tenants',
  '/app/access/tenants/new': 'New tenant',
  '/app/profile': 'Profile',
  '/app/settings': 'Settings',
  '/app/settings/ai': 'AI settings',
  '/app/settings/email': 'Email settings',
  '/app/settings/third-party': 'Third-party',
  '/app/settings/logs': 'Logs',
}

/** Dynamic modal edit routes that cannot be listed as exact keys. */
const DYNAMIC_ROUTE_TITLES: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/app\/access\/users\/[^/]+\/edit$/, title: 'Edit user' },
  { pattern: /^\/app\/access\/tenants\/[^/]+\/edit$/, title: 'Edit tenant' },
]

export function formatPageTitle(pageTitle?: string | null): string {
  if (pageTitle == null || pageTitle.trim() === '') {
    return APP_TITLE
  }
  return `${pageTitle.trim()} · ${APP_TITLE}`
}

/**
 * Resolve a document title for a pathname.
 * Prefers exact matches, then dynamic modal routes, then the longest matching prefix.
 */
export function resolvePageTitle(pathname: string): string {
  if (typeof pathname !== 'string' || pathname.trim() === '') {
    return APP_TITLE
  }

  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

  if (Object.prototype.hasOwnProperty.call(ROUTE_PAGE_TITLES, normalized)) {
    return formatPageTitle(ROUTE_PAGE_TITLES[normalized])
  }

  for (const route of DYNAMIC_ROUTE_TITLES) {
    if (route.pattern.test(normalized)) {
      return formatPageTitle(route.title)
    }
  }

  const prefixes = Object.keys(ROUTE_PAGE_TITLES)
    .filter((route) => route !== '/' && normalized.startsWith(`${route}/`))
    .sort((a, b) => b.length - a.length)

  if (prefixes.length > 0) {
    return formatPageTitle(ROUTE_PAGE_TITLES[prefixes[0]])
  }

  return APP_TITLE
}
