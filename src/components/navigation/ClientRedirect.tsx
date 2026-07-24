'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Client-side redirect for auth guards and client-only navigation. */
export function ClientRedirect({ href }: { href: string }) {
  if (typeof href !== 'string' || !href.startsWith('/')) {
    throw new Error('ClientRedirect href must be an absolute path starting with /')
  }

  const router = useRouter()

  useEffect(() => {
    router.replace(href)
  }, [href, router])

  return null
}
