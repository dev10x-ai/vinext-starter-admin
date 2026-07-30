import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputOTP } from './InputOTP'

function ControlledOtp({
  initialValue = '',
  onChange,
}: {
  initialValue?: string
  onChange: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)
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

  it('keeps later digits in place when a middle digit is deleted and replaced', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledOtp initialValue="123456" onChange={onChange} />)

    const thirdDigit = screen.getByLabelText('One-time code digit 3')
    await user.clear(thirdDigit)

    expect(screen.getByLabelText('One-time code digit 1')).toHaveValue('1')
    expect(screen.getByLabelText('One-time code digit 2')).toHaveValue('2')
    expect(thirdDigit).toHaveValue('')
    expect(screen.getByLabelText('One-time code digit 4')).toHaveValue('4')
    expect(screen.getByLabelText('One-time code digit 5')).toHaveValue('5')
    expect(screen.getByLabelText('One-time code digit 6')).toHaveValue('6')

    await user.type(thirdDigit, '9')
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('129456')
  })
})
