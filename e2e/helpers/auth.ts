import { expect, type Page } from '@playwright/test'

export async function signIn(
  page: Page,
  credentials: { email?: string; password?: string } = {},
) {
  const email = credentials.email ?? 'admin@acp.local'
  const password = credentials.password ?? 'Admin123!'
  if (!email || !password) {
    throw new Error('signIn requires email and password')
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /^sign in$/i }).click()
  await expect(page).toHaveURL(/\/app/)
}

export async function openMobileNavIfNeeded(page: Page) {
  const openMenu = page.getByRole('button', { name: 'Open menu' })
  if ((await openMenu.count()) === 0) return

  const sidebar = page.locator('#app-sidebar')
  const alreadyOpen = (await sidebar.getAttribute('data-mobile-open')) === 'true'
  if (!alreadyOpen) {
    await expect(openMenu).toBeVisible()
    await openMenu.click()
  }

  await expect(sidebar).toHaveAttribute('data-mobile-open', 'true')
  // Ensure the drawer finished sliding into the viewport (not just aria state).
  await expect(sidebar).toBeInViewport()
  await expect(sidebar.locator('a[href="/app"]')).toBeInViewport()
}
