import { expect, test } from '@playwright/test'
import { fillOtp, signIn } from './helpers/auth'

test.describe('landing + auth', () => {
  test('landing is brand-first and links to auth', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByLabel('ACP').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /operations console/i })).toBeVisible()
    await page.getByRole('link', { name: /open console/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('login has no app header controls', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel('Search')).toHaveCount(0)
    await expect(page.getByLabel('Tenant')).toHaveCount(0)
    await expect(page.getByLabel('Notifications')).toHaveCount(0)
  })

  test('signup page is available', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
  })

  test('forgot password smoke', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible()
    await page.getByLabel('Email').fill('admin@acp.local')
    await page.getByRole('button', { name: /send reset code/i }).click()
    await expect(page.getByText(/demo otp/i)).toBeVisible()
  })

  test('login reaches dashboard', async ({ page }) => {
    await signIn(page)
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByLabel('Search')).toBeVisible()
    await expect(page.getByLabel('Tenant')).toBeVisible()
  })

  test('OTP login reaches dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /login with otp/i }).click()
    await page.getByLabel('Email').fill('admin@acp.local')
    await page.getByRole('button', { name: /send otp code/i }).click()
    await expect(page).toHaveURL(/\/otp/)
    await fillOtp(page, '123456')
    await page.getByRole('button', { name: /verify/i }).click()
    await expect(page).toHaveURL(/\/app/)
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('user menu switches brand theme and appearance', async ({ page }) => {
    await signIn(page)

    await expect(page.getByLabel('Theme')).toHaveCount(0)
    await expect(page.getByLabel('Toggle night mode')).toHaveCount(0)

    await page.getByRole('button', { name: 'Open user menu' }).click()
    await page.getByRole('menuitemradio', { name: 'Emerald' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'emerald')

    await page.getByRole('menuitemradio', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark')
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByRole('menuitemradio', { name: 'System' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'system')
  })
})
