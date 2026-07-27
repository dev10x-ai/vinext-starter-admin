'use client'

import { useCallback } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'

export type ModalRouteMode = 'list' | 'create' | 'edit'

/**
 * Syncs a list page modal with path segments:
 * - `/list` list
 * - `/list/new` create modal
 * - `/list/:entityId/edit` edit modal
 */
export function useModalRoute(listPath: string) {
  if (typeof listPath !== 'string' || !listPath.startsWith('/')) {
    throw new Error('listPath must be an absolute path starting with /')
  }

  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const params = useParams<{ userId?: string; tenantId?: string; entityId?: string }>()

  const createMatch = pathname === `${listPath}/new`
  const editMatch = pathname.endsWith('/edit') && pathname.startsWith(`${listPath}/`)
  const entityId =
    (typeof params.entityId === 'string' && params.entityId) ||
    (typeof params.userId === 'string' && params.userId) ||
    (typeof params.tenantId === 'string' && params.tenantId) ||
    null

  const mode: ModalRouteMode = createMatch ? 'create' : editMatch && entityId ? 'edit' : 'list'

  const openCreate = useCallback(() => {
    router.push(`${listPath}/new`)
  }, [router, listPath])

  const openEdit = useCallback(
    (id: string) => {
      if (typeof id !== 'string' || id.trim() === '') {
        throw new Error('entity id is required')
      }
      router.push(`${listPath}/${id}/edit`)
    },
    [router, listPath],
  )

  const close = useCallback(() => {
    router.push(listPath)
  }, [router, listPath])

  return {
    mode,
    entityId: mode === 'edit' ? entityId : null,
    open: mode !== 'list',
    openCreate,
    openEdit,
    close,
  }
}
