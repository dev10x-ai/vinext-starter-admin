import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getPath, resetNavigationMock } from '@/test/next-navigation-mock'
import { useModalRoute } from './useModalRoute'

function Probe() {
  const { mode, entityId, open, openCreate, openEdit, close } = useModalRoute('/app/access/users')
  return (
    <div>
      <p data-testid="mode">{mode}</p>
      <p data-testid="entityId">{entityId ?? ''}</p>
      <p data-testid="open">{String(open)}</p>
      <p data-testid="path">{getPath()}</p>
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

describe('useModalRoute', () => {
  beforeEach(() => {
    resetNavigationMock('/app/access/users')
  })

  it('stays closed on the list path', () => {
    render(<Probe />)
    expect(screen.getByTestId('mode')).toHaveTextContent('list')
    expect(screen.getByTestId('open')).toHaveTextContent('false')
    expect(screen.getByTestId('entityId')).toHaveTextContent('')
  })

  it('opens create mode on /new', () => {
    resetNavigationMock('/app/access/users/new')
    render(<Probe />)
    expect(screen.getByTestId('mode')).toHaveTextContent('create')
    expect(screen.getByTestId('open')).toHaveTextContent('true')
  })

  it('opens edit mode and exposes entity id', () => {
    resetNavigationMock('/app/access/users/1/edit')
    render(<Probe />)
    expect(screen.getByTestId('mode')).toHaveTextContent('edit')
    expect(screen.getByTestId('entityId')).toHaveTextContent('1')
    expect(screen.getByTestId('open')).toHaveTextContent('true')
  })

  it('navigates between list, create, and edit', async () => {
    const user = userEvent.setup()
    render(<Probe />)
    await user.click(screen.getByRole('button', { name: 'Create' }))
    expect(screen.getByTestId('path')).toHaveTextContent('/app/access/users/new')
    expect(screen.getByTestId('mode')).toHaveTextContent('create')
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByTestId('path')).toHaveTextContent('/app/access/users/1/edit')
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.getByTestId('path')).toHaveTextContent('/app/access/users')
  })
})
