import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { resetNavigationMock } from '@/test/next-navigation-mock'
import { UsersPage } from './UsersPage'
import { toast } from '@/store/toast'
import type { User } from '@/types'

const users: User[] = [
  {
    id: '1',
    name: 'Alex Admin',
    email: 'admin@acp.local',
    role: 'owner',
    tenantId: '1',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: '2026-01-10T10:00:00Z',
  },
]

const getUser = vi.fn()
const getUsers = vi.fn()

vi.mock('@/lib/api', () => ({
  api: {
    get: (path: string) => {
      if (path === '/users') return getUsers()
      if (path.startsWith('/users/')) return getUser(path)
      throw new Error(`Unexpected GET ${path}`)
    },
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@/store/toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}))

function renderUsers(path: string) {
  resetNavigationMock(path)
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <UsersPage />
    </QueryClientProvider>,
  )
}

describe('UsersPage modal routes', () => {
  beforeEach(() => {
    getUsers.mockReset()
    getUser.mockReset()
    vi.mocked(toast.error).mockReset()
    getUsers.mockResolvedValue(users)
  })

  it('deep-links edit modal with loaded user', async () => {
    getUser.mockResolvedValue(users[0])
    renderUsers('/app/access/users/1/edit')

    expect(await screen.findByRole('heading', { name: 'Edit user' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Alex Admin')
    })
    expect(screen.getByLabelText('Email')).toHaveValue('admin@acp.local')
    expect(getUser).toHaveBeenCalledWith('/users/1')
  })

  it('opens create modal from /new', async () => {
    renderUsers('/app/access/users/new')
    expect(await screen.findByRole('heading', { name: 'New user' })).toBeInTheDocument()
    expect(screen.getByLabelText('Temp password')).toBeInTheDocument()
  })

  it('navigates to edit URL when Edit is clicked', async () => {
    const user = userEvent.setup()
    renderUsers('/app/access/users')
    expect(await screen.findByText('Alex Admin')).toBeInTheDocument()
    getUser.mockResolvedValue(users[0])
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(await screen.findByRole('heading', { name: 'Edit user' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Alex Admin')
    })
  })

  it('toasts and returns to list when edit target is missing', async () => {
    getUser.mockRejectedValue(new Error('Request failed (404)'))
    renderUsers('/app/access/users/999/edit')

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Edit user' })).not.toBeInTheDocument()
    })
    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument()
  })
})
