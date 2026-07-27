import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  it('renders label and reports selected file name', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FileUpload label="Import config" onChange={onChange} />)

    const input = screen.getByLabelText('Import config')
    const file = new File(['{"ok":true}'], 'filters.json', { type: 'application/json' })
    await user.upload(input, file)

    expect(onChange).toHaveBeenCalled()
    expect(screen.getByText('filters.json')).toBeInTheDocument()
  })

  it('shows empty label by default', () => {
    render(<FileUpload label="Avatar" emptyLabel="Choose a file" />)
    expect(screen.getByText('Choose a file')).toBeInTheDocument()
  })
})
