'use client'

import { useEffect } from 'react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-10 text-center">
      <p className="text-6xl font-semibold text-[var(--color-primary)]">500</p>
      <h1 className="mt-4 text-xl font-bold text-[var(--color-text)]">Unexpected error</h1>
      <p className="mt-2 max-w-md text-[var(--color-text-muted)]">
        Something went wrong while loading this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  )
}
