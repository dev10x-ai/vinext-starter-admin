import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-10 text-center">
      <p className="text-6xl font-semibold text-[var(--color-primary)]">404</p>
      <h1 className="mt-4 text-xl font-bold text-[var(--color-text)]">Page not found</h1>
      <p className="mt-2 max-w-md text-[var(--color-text-muted)]">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
      >
        Go home
      </Link>
    </div>
  )
}
