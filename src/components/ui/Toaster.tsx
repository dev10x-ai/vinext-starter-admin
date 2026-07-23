import { useToastStore } from '@/store/toast'
import { cn } from '@/lib/cn'

const TONE_CLASS: Record<string, string> = {
  error: 'border-[var(--color-danger)] bg-[var(--color-surface)] text-[var(--color-danger)]',
  success: 'border-[var(--color-success)] bg-[var(--color-surface)] text-[var(--color-success)]',
  info: 'border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-text)]',
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          role="status"
          className={cn(
            'pointer-events-auto rounded-md border px-3 py-2 text-sm shadow-lg',
            TONE_CLASS[item.tone] ?? TONE_CLASS.info,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <span>{item.message}</span>
            <button
              type="button"
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
