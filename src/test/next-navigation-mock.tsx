import { useSyncExternalStore, type ReactNode } from 'react'
import { vi } from 'vitest'

type Listener = () => void

let pathname = '/'
let params: Record<string, string> = {}
const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) listener()
}

function parseParams(path: string): Record<string, string> {
  const userEdit = path.match(/^\/app\/access\/users\/([^/]+)\/edit$/)
  if (userEdit?.[1]) return { userId: userEdit[1] }
  const tenantEdit = path.match(/^\/app\/access\/tenants\/([^/]+)\/edit$/)
  if (tenantEdit?.[1]) return { tenantId: tenantEdit[1] }
  return {}
}

export function setPath(path: string) {
  if (typeof path !== 'string' || !path.startsWith('/')) {
    throw new Error('path must be an absolute path starting with /')
  }
  pathname = path
  params = parseParams(path)
  emit()
}

export function getPath() {
  return pathname
}

const router = {
  push: vi.fn((href: string) => {
    setPath(href)
  }),
  replace: vi.fn((href: string) => {
    setPath(href)
  }),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}

export function resetNavigationMock(initialPath = '/') {
  setPath(initialPath)
  router.push.mockClear()
  router.replace.mockClear()
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => useSyncExternalStore(subscribe, () => pathname, () => pathname),
  useParams: () => useSyncExternalStore(subscribe, () => params, () => params),
  useSearchParams: () => new URLSearchParams(),
  redirect: (href: string) => {
    setPath(href)
  },
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))
