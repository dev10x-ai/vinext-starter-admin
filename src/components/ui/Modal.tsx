import type { ReactNode } from 'react'
import { Button } from './Button'
import { X } from 'lucide-react'

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-lg rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--color-divider)] px-4 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X size={16} />
          </Button>
        </div>
        <div className="p-4">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-[var(--color-divider)] px-4 py-3">{footer}</div> : null}
      </div>
    </div>
  )
}
