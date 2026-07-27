import type { ReactNode } from 'react'
import { Button } from './Button'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

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
    <div className={styles.backdrop} role="dialog" aria-modal aria-label={title}>
      <div className={styles.dialog}>
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-divider)] px-4 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" className="min-h-11 min-w-11 px-0" onClick={onClose} aria-label="Close">
            <X size={16} />
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  )
}
