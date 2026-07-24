import { cn } from '@/lib/cn'
import { AcpShieldMark } from '@/components/brand/AcpShieldMark'

type AcpLogoProps = {
  className?: string
  markClassName?: string
  /** Show the “ACP” wordmark beside the shield. */
  withWordmark?: boolean
  /** Optional muted subtitle (e.g. Admin). */
  subtitle?: string
}

/**
 * Theme-aware ACP logo. Shield fill uses `--color-primary`; wordmark uses text tokens.
 */
export function AcpLogo({
  className,
  markClassName,
  withWordmark = true,
  subtitle,
}: AcpLogoProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-2.5', className)}
      aria-label={withWordmark ? 'ACP' : undefined}
    >
      <AcpShieldMark className={cn('h-8 w-8', markClassName)} title={withWordmark ? '' : 'ACP'} />
      {withWordmark ? (
        <span className="flex flex-col leading-none" aria-hidden>
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-text)]">
            ACP
          </span>
          {subtitle ? (
            <span className="mt-0.5 text-[11px] font-medium tracking-wide text-[var(--color-text-muted)]">
              {subtitle}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  )
}
