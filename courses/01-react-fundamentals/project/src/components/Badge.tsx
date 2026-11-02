import type { ReactNode } from 'react'

export type BadgeVariant = 'default' | 'category' | 'priority' | 'tag'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  'data-tag'?: string
}

export default function Badge({ children, variant = 'default', 'data-tag': dataTag }: BadgeProps) {
  return (
    <span
      data-variant={variant}
      data-tag={dataTag}
      style={{
        display: 'inline-block',
        borderRadius: '999px',
        backgroundColor: '#e5e7eb',
        padding: '0.15rem 0.5rem',
        marginRight: '0.25rem',
      }}
    >
      {children}
    </span>
  )
}
