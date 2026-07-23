import { expect, test } from '@playwright/test'

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@acp.local')
  await page.getByLabel('Password').fill('Admin123!')
  await page.getByRole('button', { name: /^sign in$/i }).click()
  await expect(page).toHaveURL(/\/app/)
}

test.describe('command palette', () => {
  test('Ctrl/Meta+K opens search and navigates to a result URL', async ({ page }) => {
    await signIn(page)

    await page.keyboard.press('ControlOrMeta+K')
    await expect(page.getByRole('dialog', { name: /search console/i })).toBeVisible()
    await expect(page.getByLabel('Search query')).toBeFocused()

    await page.getByLabel('Search query').fill('alex')
    await expect(page.getByRole('option', { name: /alex admin/i })).toBeVisible({ timeout: 5000 })
    await page.getByRole('option', { name: /alex admin/i }).click()

    await expect(page).toHaveURL(/\/app\/access\/users\/1\/edit/)
    await expect(page.getByRole('dialog', { name: /search console/i })).toHaveCount(0)
  })

  test('header search trigger opens the palette', async ({ page }) => {
    await signIn(page)
    await page.getByLabel('Search').click()
    await expect(page.getByRole('dialog', { name: /search console/i })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: /search console/i })).toHaveCount(0)
  })
})
