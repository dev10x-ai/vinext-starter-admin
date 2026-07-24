import { cn } from '@/lib/cn'

type AcpShieldMarkProps = {
  className?: string
  title?: string
  /**
   * Single-color silhouette using `currentColor`
   * (docs masks, mono embeds). Default uses theme CSS variables.
   */
  mono?: boolean
}

/** Shared shield outer path (viewBox 0 0 40 40). */
export const ACP_SHIELD_PATH =
  'M20 2.5c3.2 0 9.6 2.2 13.2 4.1.7.4 1.1 1.1 1.1 1.9v10c0 8.2-5.6 14.2-13.4 17.3a2.2 2.2 0 0 1-1.8 0C11.3 32.7 5.7 26.7 5.7 18.5v-10c0-.8.4-1.5 1.1-1.9C10.4 4.7 16.8 2.5 20 2.5Z'

/** Solid keyhole silhouette (for mono cutouts). */
export const ACP_KEYHOLE_SOLID_PATH =
  'M20 11.2a3.6 3.6 0 0 0-1.9 6.7l-.7 8.6h5.2l-.7-8.6A3.6 3.6 0 0 0 20 11.2Z'

/** Keyhole glyph with open eye (for color mark on shield). */
export const ACP_KEYHOLE_PATH =
  'M20 11.2a3.6 3.6 0 0 0-1.9 6.7l-.7 8.6h5.2l-.7-8.6A3.6 3.6 0 0 0 20 11.2Zm0 2.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z'

/**
 * ACP shield mark — recolors with the active theme via CSS variables
 * (`--color-primary` / `--color-surface`), or `currentColor` when `mono`.
 */
export function AcpShieldMark({ className, title = 'ACP', mono = false }: AcpShieldMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={cn('shrink-0', className)}
      role={title ? 'img' : 'presentation'}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      {mono ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={`${ACP_SHIELD_PATH} ${ACP_KEYHOLE_SOLID_PATH}`}
          fill="currentColor"
        />
      ) : (
        <>
          <path d={ACP_SHIELD_PATH} fill="var(--color-primary)" />
          <path
            d="M20 5.2c2.6 0 7.8 1.7 10.6 3.2.3.2.5.5.5.8v9.3c0 6.6-4.4 11.5-10.6 14.1a1 1 0 0 1-.9 0C13.3 29.9 8.9 25 8.9 18.5V9.2c0-.3.2-.6.5-.8C12.2 6.9 17.4 5.2 20 5.2Z"
            fill="var(--color-surface)"
            opacity={0.16}
          />
          <path d={ACP_KEYHOLE_PATH} fill="var(--color-surface)" />
        </>
      )}
    </svg>
  )
}
