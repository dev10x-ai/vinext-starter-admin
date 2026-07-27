'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { useDashboardStatsQuery } from '@/queries'

export function DashboardView() {
  const { data: stats = [], isLoading } = useDashboardStatsQuery()

  return (
    <div>
      <PageHeader title="Dashboard" description="Modern stats and widget slots for future modules." />
      {isLoading ? <p className="mb-3 text-sm text-[var(--color-text-muted)]">Loading stats…</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.id}>
            <p className="text-sm text-[var(--color-text-muted)]">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value.toLocaleString()}</p>
            <p className={`mt-1 text-xs ${s.delta >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {s.delta >= 0 ? '+' : ''}
              {s.delta}% vs last week
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-[var(--color-text-muted)]">API volume</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={(stats[2]?.series ?? []).map((v, i) => ({ day: `D${i + 1}`, value: v }))}>
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="var(--hero-glow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)]">Widget slot</h2>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            Reserved for future ACP modules (queues, battles, compliance). Drop charts or feeds here.
          </p>
          <div className="mt-6 h-32 rounded-md border border-dashed border-[var(--color-divider)] bg-[var(--color-accent)]" />
        </Card>
      </div>
    </div>
  )
}