import { useMemo, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/cn'
import { useUiStore } from '@/store/ui'
import { ChevronDown, ChevronUp, Columns3, Download, Filter } from 'lucide-react'
import styles from './DataTable.module.css'

export type Column<T> = {
  key: string
  label: string
  sortable?: boolean
  defaultVisible?: boolean
  render: (row: T) => ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  filterPanel?: ReactNode
  onExport?: () => void
  searchPlaceholder?: string
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  filterPanel,
  onExport,
  searchPlaceholder = 'Filter table…',
}: Props<T>) {
  const pageSize = useUiStore((s) => s.tablePrefs.pageSize)
  const setTablePageSize = useUiStore((s) => s.setTablePageSize)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showColumns, setShowColumns] = useState(false)
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(columns.map((c) => [c.key, c.defaultVisible !== false])),
  )

  const visibleColumns = columns.filter((c) => visible[c.key])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = rows
    if (q) {
      list = list.filter((row) => JSON.stringify(row).toLowerCase().includes(q))
    }
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? '')
        const bv = String((b as Record<string, unknown>)[sortKey] ?? '')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    }
    return list
  }, [rows, query, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const rangeEnd = Math.min(safePage * pageSize, filtered.length)

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir('asc')
      return
    }
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <div
      className={cn(
        styles.root,
        'space-y-3 rounded-lg border border-[var(--color-divider)] bg-[var(--color-card)] p-3 md:p-4',
      )}
    >
      <div className={styles.toolbar}>
        <div className={styles.toolbarSearch}>
          <Input
            aria-label="Global table filter"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className={styles.toolbarActions}>
          <Button variant="secondary" size="sm" className="min-h-11" onClick={() => setShowFilters((v) => !v)}>
            <Filter size={14} /> Filters
          </Button>
          <div className="relative">
            <Button variant="secondary" size="sm" className="min-h-11" onClick={() => setShowColumns((v) => !v)}>
              <Columns3 size={14} /> Columns
            </Button>
            {showColumns ? (
              <div className="absolute right-0 z-20 mt-1 w-52 max-w-[calc(100vw-2rem)] rounded-md border border-[var(--color-divider)] bg-[var(--color-surface)] p-2 shadow-lg">
                {columns.map((c) => (
                  <label key={c.key} className="flex min-h-11 items-center gap-2 px-2 py-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={visible[c.key]}
                      onChange={(e) => setVisible((v) => ({ ...v, [c.key]: e.target.checked }))}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          {onExport ? (
            <Button variant="secondary" size="sm" className="min-h-11" onClick={onExport}>
              <Download size={14} /> Export
            </Button>
          ) : null}
        </div>
      </div>

      {showFilters && filterPanel ? (
        <div className="rounded-md border border-[var(--color-divider)] bg-[var(--color-accent)] p-3">{filterPanel}</div>
      ) : null}

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr className="border-b border-[var(--color-divider)] text-[var(--color-text-muted)]">
              {visibleColumns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-3 py-2 font-medium">
                  {c.sortable ? (
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center gap-1"
                      onClick={() => toggleSort(c.key)}
                    >
                      {c.label}
                      {sortKey === c.key ? sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} /> : null}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-3 py-8 text-center text-[var(--color-text-muted)]">
                  No results
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr
                  key={rowKey(row)}
                  className={cn('border-b border-[var(--color-divider)]', idx % 2 === 1 && 'bg-[var(--color-accent)]/40')}
                >
                  {visibleColumns.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-3 py-2.5">
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span aria-live="polite">
          Showing {rangeStart}–{rangeEnd} of {filtered.length}
        </span>
        <div className={styles.footerControls}>
          <label className="inline-flex min-h-11 items-center gap-2">
            <span className="whitespace-nowrap">Rows per page</span>
            <select
              className="rounded-md border border-[var(--color-divider)] bg-[var(--color-surface)] px-2 py-1.5 text-sm text-[var(--color-text)]"
              value={pageSize}
              onChange={(e) => {
                setTablePageSize(Number(e.target.value))
                setPage(1)
              }}
              aria-label="Page size"
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
            >
              Prev
            </Button>
            <span className="tabular-nums">
              Page {safePage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
