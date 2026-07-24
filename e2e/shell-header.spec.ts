import { expect, test } from '@playwright/test'
import { openMobileNavIfNeeded, signIn } from './helpers/auth'

test.describe('app shell header', () => {
  test('tenant switcher changes selection', async ({ page }) => {
    await signIn(page)
    await page.getByLabel('Tenant').click()
    await expect(page.getByRole('listbox', { name: 'Tenants' })).toBeVisible()
    await page.getByRole('option', { name: /xip staging/i }).click()
    await expect(page.getByLabel('Tenant')).toContainText(/xip staging/i)
  })

  test('notifications drawer opens and closes', async ({ page }) => {
    await signIn(page)
    await page.getByLabel('Notifications').click()
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible()
    await page.getByRole('button', { name: 'Close notifications' }).click()
    await expect(page.getByRole('heading', { name: 'Notifications' })).toHaveCount(0)
  })

  test('sidebar links reach major sections', async ({ page, isMobile }) => {
    // Mobile drawer navigation is covered by mobile-shell.spec.ts; keep this
    // assertion on desktop where the rail is always in-flow.
    test.skip(!!isMobile, 'covered by mobile-shell drawer navigation')

    await signIn(page)
    const sidebar = page.locator('#app-sidebar')

    await sidebar.locator('a[href="/app/access/users"]').click()
    await expect(page).toHaveURL(/\/app\/access\/users$/)
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()

    await sidebar.locator('a[href="/app/access/roles"]').click()
    await expect(page).toHaveURL(/\/app\/access\/roles/)
    await expect(page.getByRole('heading', { name: /roles/i })).toBeVisible()

    await sidebar.locator('a[href="/app/settings"]').click()
    await expect(page).toHaveURL(/\/app\/settings/)
    await expect(page.getByRole('heading', { name: /platform settings/i })).toBeVisible()
  })
})
