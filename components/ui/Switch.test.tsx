import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders as a switch and toggles', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch label="Allow export" name="exportEnabled" onChange={onChange} />)

    const control = screen.getByRole('switch', { name: 'Allow export' })
    expect(control).not.toBeChecked()
    await user.click(control)
    expect(onChange).toHaveBeenCalled()
  })

  it('respects disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch label="Locked" disabled onChange={onChange} />)
    await user.click(screen.getByRole('switch', { name: 'Locked' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
