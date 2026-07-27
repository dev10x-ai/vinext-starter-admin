'use client'

import Link from 'next/link'

import { AcpLogo } from '@/components/brand/AcpLogo'
import { AcpShieldMark } from '@/components/brand/AcpShieldMark'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Gauge, Layers, ShieldCheck } from 'lucide-react'

export function LandingView() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="hero-glow pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl"
          style={{ background: 'var(--hero-glow)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(1200px 500px at 80% -10%, var(--hero-glow), transparent), linear-gradient(180deg, var(--color-surface), var(--color-background))',
          }}
        />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 md:grid-cols-2 md:px-6">
          <div className="animate-fade-up">
            <AcpLogo className="mb-8" markClassName="h-12 w-12 md:h-14 md:w-14" />
            <h1 className="max-w-xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Operations console for multi-tenant platforms
            </h1>
            <p className="mt-4 max-w-lg text-base text-[var(--color-text-muted)] md:text-lg">
              Access control, tenant governance, and platform settings in one sober admin shell — mocked for rapid product exploration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button size="lg">
                  Start free <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Open console
                </Button>
              </Link>
            </div>
          </div>
          <div className="animate-fade-up-delay relative hidden md:block">
            <div className="absolute inset-0 rounded-2xl bg-[var(--hero-glow)] blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)] shadow-2xl">
              <AcpShieldMark
                title=""
                className="absolute -right-6 -top-6 h-40 w-40 opacity-10"
              />
              <div className="space-y-4 p-8">
                <div className="h-3 w-24 rounded bg-[var(--color-primary)]/80" />
                <div className="grid grid-cols-2 gap-3">
                  {['Users', 'Tenants', 'Roles', 'Settings'].map((label) => (
                    <div key={label} className="rounded-lg border border-[var(--color-divider)] bg-[var(--color-accent)] p-4">
                      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">—</p>
                    </div>
                  ))}
                </div>
                <div className="h-28 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/20 via-transparent to-[var(--color-secondary)]/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="border-t border-[var(--color-divider)] py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Built for operators</h2>
          <p className="mt-2 max-w-2xl text-[var(--color-text-muted)]">
            One composition for governance — not a dashboard collage. Clear access, clear tenants, clear settings.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Access first', body: 'Users, roles, permissions, and editable menu trees.' },
              { icon: Layers, title: 'Multi-tenant', body: 'Switch tenants from the header; manage orgs with Filament-style tables.' },
              { icon: Gauge, title: 'Platform ready', body: 'AI providers, email, third-party APIs, and logs under settings.' },
            ].map((f) => (
              <div key={f.title}>
                <f.icon className="text-[var(--color-primary)]" size={22} />
                <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="border-t border-[var(--color-divider)] bg-[var(--color-surface)] py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Read the docs</h2>
            <p className="mt-2 text-[var(--color-text-muted)]">Getting started, components, and REST API examples.</p>
          </div>
          <a href="/docs/">
            <Button size="lg" variant="secondary">
              Open documentation
            </Button>
          </a>
        </div>
      </section>
    </>
  )
}