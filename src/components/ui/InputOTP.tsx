import { useId, useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

const DEFAULT_LENGTH = 6

type Props = {
  label?: string
  error?: string
  hint?: string
  length?: number
  value?: string
  name?: string
  id?: string
  disabled?: boolean
  autoFocus?: boolean
  autoComplete?: string
  inputMode?: 'numeric' | 'text'
  onChange?: (value: string) => void
  onBlur?: () => void
  className?: string
}

function normalizeDigits(raw: string, length: number): string {
  return raw.replace(/\D/g, '').slice(0, length)
}

export function InputOTP({
  label,
  error,
  hint,
  length = DEFAULT_LENGTH,
  value = '',
  name,
  id,
  disabled,
  autoFocus,
  autoComplete = 'one-time-code',
  inputMode = 'numeric',
  onChange,
  onBlur,
  className,
}: Props) {
  if (!Number.isInteger(length) || length < 1) {
    throw new Error('InputOTP length must be a positive integer')
  }

  const generatedId = useId()
  const groupId = id ?? name ?? generatedId
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const digits = normalizeDigits(value, length).padEnd(length, ' ').slice(0, length).split('')

  const emit = (next: string) => {
    onChange?.(normalizeDigits(next, length))
  }

  const focusAt = (index: number) => {
    const el = inputsRef.current[index]
    el?.focus()
    el?.select()
  }

  const handleDigitChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '')
    if (!cleaned) {
      const chars = normalizeDigits(value, length).split('')
      chars[index] = ''
      emit(chars.join(''))
      return
    }

    const chars = normalizeDigits(value, length).padEnd(length, '').split('')
    const incoming = cleaned.split('')
    let cursor = index
    for (const digit of incoming) {
      if (cursor >= length) break
      chars[cursor] = digit
      cursor += 1
    }
    emit(chars.join('').slice(0, length))
    if (cursor < length) focusAt(cursor)
    else inputsRef.current[length - 1]?.blur()
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      const current = normalizeDigits(value, length)
      if (current[index]) {
        const chars = current.split('')
        chars[index] = ''
        emit(chars.join(''))
        return
      }
      if (index > 0) {
        event.preventDefault()
        const chars = current.split('')
        chars[index - 1] = ''
        emit(chars.join(''))
        focusAt(index - 1)
      }
      return
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusAt(index - 1)
    }
    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault()
      focusAt(index + 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    emit(event.clipboardData.getData('text'))
  }

  return (
    <div className={cn('flex flex-col gap-1.5 text-sm', className)}>
      {label ? (
        <span id={`${groupId}-label`} className="font-medium text-[var(--color-text)]">
          {label}
        </span>
      ) : null}
      <div
        role="group"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={error ? `${groupId}-error` : hint ? `${groupId}-hint` : undefined}
        className="flex flex-wrap gap-2"
      >
        {Array.from({ length }, (_, index) => {
          const digit = digits[index]?.trim() ?? ''
          return (
            <input
              key={`${groupId}-${index}`}
              ref={(el) => {
                inputsRef.current[index] = el
              }}
              id={index === 0 ? groupId : `${groupId}-${index}`}
              name={index === 0 ? name : undefined}
              inputMode={inputMode}
              autoComplete={index === 0 ? autoComplete : 'off'}
              autoFocus={autoFocus && index === 0}
              disabled={disabled}
              aria-label={label ? `${label} digit ${index + 1}` : `Digit ${index + 1}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onBlur={onBlur}
              className={cn(
                'h-12 w-10 rounded-md border bg-[var(--color-surface)] text-center text-base font-semibold outline-none transition-colors sm:h-11 sm:w-11',
                'border-[var(--color-divider)] focus:border-[var(--color-primary)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-[var(--color-danger)]',
              )}
            />
          )
        })}
      </div>
      {error ? (
        <span id={`${groupId}-error`} className="text-xs text-[var(--color-danger)]">
          {error}
        </span>
      ) : null}
      {!error && hint ? (
        <span id={`${groupId}-hint`} className="text-xs text-[var(--color-text-muted)]">
          {hint}
        </span>
      ) : null}
    </div>
  )
}
