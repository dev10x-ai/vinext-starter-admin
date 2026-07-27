import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './Prose.module.css'

type Props = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  /** Render as a different element (default `div`). */
  as?: 'div' | 'article' | 'section'
}

/**
 * Theme-aware typography wrapper. Style semantic HTML descendants with CSS variables
 * (headings, lists, tables, quotes, code, links, etc.).
 */
export function Prose({ as: Tag = 'div', className, children, ...props }: Props) {
  return (
    <Tag className={cn(styles.prose, className)} {...props}>
      {children}
    </Tag>
  )
}
