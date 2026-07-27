import { describe, expect, it } from 'vitest'
import { APP_TITLE, formatPageTitle, resolvePageTitle } from './pageTitle'

describe('formatPageTitle', () => {
  it('returns app title alone when page title is empty', () => {
    expect(formatPageTitle()).toBe(APP_TITLE)
    expect(formatPageTitle(null)).toBe(APP_TITLE)
    expect(formatPageTitle('')).toBe(APP_TITLE)
    expect(formatPageTitle('   ')).toBe(APP_TITLE)
  })

  it('joins page and app title with a middle dot', () => {
    expect(formatPageTitle('Dashboard')).toBe('Dashboard · ACP Admin')
    expect(formatPageTitle('  Users  ')).toBe('Users · ACP Admin')
  })
})

describe('resolvePageTitle', () => {
  it('resolves landing and auth routes', () => {
    expect(resolvePageTitle('/')).toBe('ACP Admin')
    expect(resolvePageTitle('/login')).toBe('Login · ACP Admin')
    expect(resolvePageTitle('/signup')).toBe('Sign up · ACP Admin')
    expect(resolvePageTitle('/forgot-password')).toBe('Forgot password · ACP Admin')
    expect(resolvePageTitle('/otp')).toBe('Verify code · ACP Admin')
    expect(resolvePageTitle('/change-password')).toBe('Change password · ACP Admin')
  })

  it('resolves app routes', () => {
    expect(resolvePageTitle('/app')).toBe('Dashboard · ACP Admin')
    expect(resolvePageTitle('/app/')).toBe('Dashboard · ACP Admin')
    expect(resolvePageTitle('/app/access/users')).toBe('Users · ACP Admin')
    expect(resolvePageTitle('/app/access/users/new')).toBe('New user · ACP Admin')
    expect(resolvePageTitle('/app/access/users/1/edit')).toBe('Edit user · ACP Admin')
    expect(resolvePageTitle('/app/access/roles')).toBe('Roles · ACP Admin')
    expect(resolvePageTitle('/app/access/menu')).toBe('Menu · ACP Admin')
    expect(resolvePageTitle('/app/access/tenants')).toBe('Tenants · ACP Admin')
    expect(resolvePageTitle('/app/access/tenants/new')).toBe('New tenant · ACP Admin')
    expect(resolvePageTitle('/app/access/tenants/2/edit')).toBe('Edit tenant · ACP Admin')
    expect(resolvePageTitle('/app/profile')).toBe('Profile · ACP Admin')
    expect(resolvePageTitle('/app/design-system/forms')).toBe('Forms · ACP Admin')
    expect(resolvePageTitle('/app/design-system/typography')).toBe('Typography · ACP Admin')
    expect(resolvePageTitle('/app/settings/ai')).toBe('AI settings · ACP Admin')
    expect(resolvePageTitle('/app/settings/email')).toBe('Email settings · ACP Admin')
    expect(resolvePageTitle('/app/settings/third-party')).toBe('Third-party · ACP Admin')
    expect(resolvePageTitle('/app/settings/logs')).toBe('Logs · ACP Admin')
  })

  it('falls back to app title for unknown paths', () => {
    expect(resolvePageTitle('')).toBe(APP_TITLE)
    expect(resolvePageTitle('/unknown')).toBe(APP_TITLE)
  })
})
