'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { AcpLogo } from '@/components/brand/AcpLogo'

/** Auth screens: brand mark only — no app header (search/tenant/user). */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-background)]">
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-md animate-fade-up">
          <Link href="/" className="mb-6 flex justify-center sm:mb-8">
            <AcpLogo markClassName="h-9 w-9" />
          </Link>
          <div className="rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
