import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@/test/next-navigation-mock'
import { LoginView } from './login-view'

const login = vi.fn()
const requestOtpLogin = vi.fn()

vi.mock('@/store/auth', () => ({
  useAuthStore: (selector: (s: { login: typeof login; requestOtpLogin: typeof requestOtpLogin }) => unknown) =>
    selector({ login, requestOtpLogin }),
}))

describe('LoginView', () => {
  beforeEach(() => {
    login.mockReset()
    requestOtpLogin.mockReset()
  })

  it('renders without app header chrome', () => {
    render(<LoginView />)
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.queryByLabelText('Search')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Tenant')).not.toBeInTheDocument()
  })

  it('submits password credentials', async () => {
    login.mockResolvedValue('ok')
    const user = userEvent.setup()
    render(<LoginView />)
    await user.type(screen.getByLabelText('Email'), 'admin@acp.local')
    await user.type(screen.getByLabelText('Password'), 'Admin123!')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(login).toHaveBeenCalledWith('admin@acp.local', 'Admin123!')
  })

  it('requests OTP login', async () => {
    requestOtpLogin.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LoginView />)
    await user.click(screen.getByRole('button', { name: /login with otp/i }))
    await user.type(screen.getByLabelText('Email'), 'admin@acp.local')
    await user.click(screen.getByRole('button', { name: /send otp code/i }))
    expect(requestOtpLogin).toHaveBeenCalledWith('admin@acp.local')
  })
})
