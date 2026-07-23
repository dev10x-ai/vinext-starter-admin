import { Link, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-divider)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/branding/acp-logo.svg" alt="ACP" className="h-8" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-[var(--color-text-muted)] md:flex">
            <a href="#product" className="hover:text-[var(--color-text)]">
              Product
            </a>
            <a href="#platform" className="hover:text-[var(--color-text)]">
              Platform
            </a>
            <a href="http://localhost:3000" className="hover:text-[var(--color-text)]">
              Docs
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="border-t border-[var(--color-divider)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-[var(--color-text-muted)] md:flex-row md:items-center md:justify-between md:px-6">
          <img src="/branding/acp-mark.svg" alt="" className="h-7 w-7" />
          <p>© {new Date().getFullYear()} ACP Admin. Mocked demo frontend.</p>
          <div className="flex gap-4">
            <a href="http://localhost:3000">Documentation</a>
            <Link to="/login">Console</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
