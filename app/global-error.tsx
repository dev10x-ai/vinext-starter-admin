'use client'

import { useEffect } from 'react'
import '@/styles/globals.css'

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-6xl font-semibold">500</p>
          <h1 className="mt-4 text-xl font-bold">Unexpected error</h1>
          <p className="mt-2 max-w-md text-neutral-500">
            Something went wrong while loading the application. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
