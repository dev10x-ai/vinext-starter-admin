import { useCallback } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'

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

  const navigate = useNavigate()
  const createMatch = useMatch({ path: `${listPath}/new`, end: true })
  const editMatch = useMatch({ path: `${listPath}/:entityId/edit`, end: true })
  const entityId = editMatch?.params.entityId ?? null

  const mode: ModalRouteMode = createMatch ? 'create' : entityId ? 'edit' : 'list'

  const openCreate = useCallback(() => {
    void navigate(`${listPath}/new`)
  }, [navigate, listPath])

  const openEdit = useCallback(
    (id: string) => {
      if (typeof id !== 'string' || id.trim() === '') {
        throw new Error('entity id is required')
      }
      void navigate(`${listPath}/${id}/edit`)
    },
    [navigate, listPath],
  )

  const close = useCallback(() => {
    void navigate(listPath)
  }, [navigate, listPath])

  return {
    mode,
    entityId,
    open: mode !== 'list',
    openCreate,
    openEdit,
    close,
  }
}
