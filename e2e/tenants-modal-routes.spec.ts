import { expect, test } from '@playwright/test'
import { signIn } from './helpers/auth'

test.describe('tenants modal routes', () => {
  test('edit deep link opens modal with tenant loaded', async ({ page }) => {
    await signIn(page)
    await page.goto('/app/access/tenants/1/edit')
    await expect(page).toHaveURL(/\/app\/access\/tenants\/1\/edit$/)
    await expect(page.getByRole('heading', { name: 'Edit tenant' })).toBeVisible()
    await expect(page.getByLabel('Name')).toHaveValue('ACP Demo')
    await expect(page.getByLabel('Slug')).toHaveValue('acp-demo')
  })

  test('closing edit modal returns to tenants list URL', async ({ page }) => {
    await signIn(page)
    await page.goto('/app/access/tenants/1/edit')
    await expect(page.getByRole('heading', { name: 'Edit tenant' })).toBeVisible()
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page).toHaveURL(/\/app\/access\/tenants$/)
    await expect(page.getByRole('heading', { name: 'Edit tenant' })).toHaveCount(0)
  })

  test('new tenant path opens create modal', async ({ page }) => {
    await signIn(page)
    await page.goto('/app/access/tenants/new')
    await expect(page.getByRole('heading', { name: 'New tenant' })).toBeVisible()
    await expect(page.getByLabel('Slug')).toBeVisible()
  })
})
