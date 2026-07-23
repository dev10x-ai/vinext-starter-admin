import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useModalRoute } from './useModalRoute'

function Probe() {
  const { mode, entityId, open, openCreate, openEdit, close } = useModalRoute('/app/access/users')
  const location = useLocation()
  return (
    <div>
      <p data-testid="mode">{mode}</p>
      <p data-testid="entityId">{entityId ?? ''}</p>
      <p data-testid="open">{String(open)}</p>
      <p data-testid="path">{location.pathname}</p>
      <button type="button" onClick={openCreate}>
        Create
      </button>
      <button type="button" onClick={() => openEdit('1')}>
        Edit
      </button>
      <button type="button" onClick={close}>
        Close
      </button>
    </div>
  )
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/access/users" element={<Probe />} />
        <Route path="/app/access/users/new" element={<Probe />} />
        <Route path="/app/access/users/:userId/edit" element={<Probe />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('useModalRoute', () => {
  it('stays closed on the list path', () => {
    renderAt('/app/access/users')
    expect(screen.getByTestId('mode')).toHaveTextContent('list')
    expect(screen.getByTestId('open')).toHaveTextContent('false')
    expect(screen.getByTestId('entityId')).toHaveTextContent('')
  })

  it('opens create mode on /new', () => {
    renderAt('/app/access/users/new')
    expect(screen.getByTestId('mode')).toHaveTextContent('create')
    expect(screen.getByTestId('open')).toHaveTextContent('true')
  })

  it('opens edit mode and exposes entity id', () => {
    renderAt('/app/access/users/1/edit')
    expect(screen.getByTestId('mode')).toHaveTextContent('edit')
    expect(screen.getByTestId('entityId')).toHaveTextContent('1')
    expect(screen.getByTestId('open')).toHaveTextContent('true')
  })

  it('navigates between list, create, and edit', async () => {
    const user = userEvent.setup()
    renderAt('/app/access/users')
    await user.click(screen.getByRole('button', { name: 'Create' }))
    expect(screen.getByTestId('path')).toHaveTextContent('/app/access/users/new')
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByTestId('path')).toHaveTextContent('/app/access/users/1/edit')
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.getByTestId('path')).toHaveTextContent('/app/access/users')
  })
})
