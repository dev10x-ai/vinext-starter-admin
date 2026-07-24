import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders label and accepts input', async () => {
    const user = userEvent.setup()
    render(<Textarea label="Description" name="description" />)
    const field = screen.getByLabelText('Description')
    await user.type(field, 'Operator role')
    expect(field).toHaveValue('Operator role')
  })

  it('shows error message', () => {
    render(<Textarea label="Notes" error="Too short" />)
    expect(screen.getByText('Too short')).toBeInTheDocument()
  })
})
