import { expect, test } from '@playwright/test'

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@acp.local')
  await page.getByLabel('Password').fill('Admin123!')
  await page.getByRole('button', { name: /^sign in$/i }).click()
  await expect(page).toHaveURL(/\/app/)
}

test.describe('users modal routes', () => {
  test('edit deep link opens modal with user loaded', async ({ page }) => {
    await login(page)
    await page.goto('/app/access/users/1/edit')
    await expect(page).toHaveURL(/\/app\/access\/users\/1\/edit$/)
    await expect(page.getByRole('heading', { name: 'Edit user' })).toBeVisible()
    await expect(page.getByLabel('Name')).toHaveValue('Alex Admin')
    await expect(page.getByLabel('Email')).toHaveValue('admin@acp.local')
  })

  test('closing edit modal returns to users list URL', async ({ page }) => {
    await login(page)
    await page.goto('/app/access/users/1/edit')
    await expect(page.getByRole('heading', { name: 'Edit user' })).toBeVisible()
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page).toHaveURL(/\/app\/access\/users$/)
    await expect(page.getByRole('heading', { name: 'Edit user' })).toHaveCount(0)
  })

  test('new user path opens create modal', async ({ page }) => {
    await login(page)
    await page.goto('/app/access/users/new')
    await expect(page.getByRole('heading', { name: 'New user' })).toBeVisible()
    await expect(page.getByLabel('Temp password')).toBeVisible()
  })
})
