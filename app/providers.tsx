'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DocumentTitle } from '@/components/DocumentTitle'
import { useThemeStore } from '@/store/theme'

function ThemeHydrator() {
  const hydrate = useThemeStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeHydrator />
      <DocumentTitle />
      {children}
    </QueryClientProvider>
  )
}
