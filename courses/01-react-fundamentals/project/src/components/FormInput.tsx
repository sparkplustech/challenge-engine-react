import type { ChangeEvent, Ref } from 'react'

interface FormInputProps {
  id: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  label: string
  type?: string
  placeholder?: string
  error?: string
  multiline?: boolean
  inputRef?: Ref<HTMLInputElement>
}

export default function FormInput({
  id,
  value,
  onChange,
  label,
  type = 'text',
  placeholder,
  error,
  multiline = false,
  inputRef,
}: FormInputProps) {
  const field = multiline ? (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  ) : (
    <input
      id={id}
      ref={inputRef}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  )

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {field}
      {error && <span id={`${id}-error`} role="alert">{error}</span>}
    </div>
  )
}
