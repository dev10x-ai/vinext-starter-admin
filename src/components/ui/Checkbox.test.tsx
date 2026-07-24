import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders label and toggles checked state', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Enabled" name="enabled" onChange={onChange} />)

    const input = screen.getByRole('checkbox', { name: 'Enabled' })
    expect(input).not.toBeChecked()
    await user.click(input)
    expect(onChange).toHaveBeenCalled()
  })

  it('shows error instead of hint', () => {
    render(<Checkbox label="Accept" error="Required" hint="Optional helper" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.queryByText('Optional helper')).not.toBeInTheDocument()
  })
})
