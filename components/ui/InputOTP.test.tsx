import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputOTP } from './InputOTP'

function ControlledOtp({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <InputOTP
      label="One-time code"
      length={6}
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

describe('InputOTP', () => {
  it('renders length digits and collects a code', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledOtp onChange={onChange} />)

    expect(screen.getByLabelText('One-time code digit 1')).toBeInTheDocument()
    expect(screen.getByLabelText('One-time code digit 6')).toBeInTheDocument()

    await user.type(screen.getByLabelText('One-time code digit 1'), '123456')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('123456')
  })

  it('shows error text', () => {
    render(<InputOTP label="Code" value="12" error="Incomplete" />)
    expect(screen.getByText('Incomplete')).toBeInTheDocument()
  })
})
