import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  disabled?: boolean
  id?: string
  'data-active'?: string
  'aria-pressed'?: boolean
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  id,
  'data-active': dataActive,
  'aria-pressed': ariaPressed,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-active={dataActive}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  )
}
