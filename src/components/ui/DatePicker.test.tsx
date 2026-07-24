import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('renders a date input with label', async () => {
    const user = userEvent.setup()
    render(<DatePicker label="Purge before" name="purgeBefore" />)
    const field = screen.getByLabelText('Purge before')
    expect(field).toHaveAttribute('type', 'date')
    await user.clear(field)
    await user.type(field, '2026-01-15')
    expect(field).toHaveValue('2026-01-15')
  })

  it('shows hint when there is no error', () => {
    render(<DatePicker label="Start" hint="UTC date" />)
    expect(screen.getByText('UTC date')).toBeInTheDocument()
  })
})
