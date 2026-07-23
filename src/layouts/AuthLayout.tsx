import { Outlet, Link } from 'react-router-dom'

/** Auth screens: brand mark only — no app header (search/tenant/user). */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="mb-8 flex justify-center">
            <img src="/branding/acp-logo.svg" alt="ACP" className="h-9 dark:brightness-110" />
          </Link>
          <div className="rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
