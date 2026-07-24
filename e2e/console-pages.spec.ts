import { expect, test } from '@playwright/test'
import { signIn } from './helpers/auth'

test.describe('console pages smoke', () => {
  test('roles page lists roles and shows permission editor', async ({ page }) => {
    await signIn(page)
    await page.goto('/app/access/roles')
    await expect(page.getByRole('heading', { name: /roles/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /owner/i }).first()).toBeVisible()
    await page.getByRole('button', { name: /operator/i }).first().click()
    await expect(page.getByLabel('Role name')).toBeVisible()
  })

  test('menu tree expands and selects a node', async ({ page }, testInfo) => {
    const isMobile = testInfo.project.name === 'Mobile Chrome'
    await signIn(page)
    await page.goto('/app/access/menu')
    await expect(page.getByRole('heading', { name: /menu tree/i })).toBeVisible()
    await expect(page.getByRole('tree', { name: /menu hierarchy/i })).toBeVisible()

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth }
    })
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1)

    const accessExpand = page.getByRole('button', { name: /collapse access|expand access/i })
    if (await accessExpand.isVisible()) {
      const label = await accessExpand.getAttribute('aria-label')
      if (label?.toLowerCase().includes('collapse')) {
        await accessExpand.click()
        await expect(page.getByRole('button', { name: /expand access/i })).toBeVisible()
        await page.getByRole('button', { name: /expand access/i }).click()
      }
    }

    await page.getByRole('treeitem', { name: /users/i }).click()
    await expect(page.getByLabel('Label')).toHaveValue(/users/i)

    if (isMobile) {
      const dialog = page.getByRole('dialog', { name: /edit · users/i })
      await expect(dialog).toBeVisible()
      const box = await dialog.boundingBox()
      expect(box).toBeTruthy()
      if (box) {
        expect(box.width).toBeGreaterThan(300)
      }
      await expect(page.getByRole('button', { name: /save item/i })).toBeVisible()
      await page.getByRole('button', { name: 'Close' }).click()
      await expect(dialog).toHaveCount(0)
    } else {
      await expect(page.getByRole('dialog')).toHaveCount(0)
      await expect(page.getByText(/select a menu node to edit/i)).toHaveCount(0)
    }
  })

  test('profile and 2FA controls are available', async ({ page }) => {
    await signIn(page)
    await page.goto('/app/profile')
    await expect(page.getByRole('heading', { name: /my profile/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /two-factor authentication/i })).toBeVisible()
    await expect(page.getByRole('switch', { name: /2fa/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /change password/i })).toBeVisible()
  })

  test('settings subpages load', async ({ page }) => {
    await signIn(page)
    await page.goto('/app/settings/ai')
    await expect(page.getByRole('heading', { name: 'AI providers' })).toBeVisible()

    await page.getByRole('link', { name: 'Email providers' }).click()
    await expect(page).toHaveURL(/\/app\/settings\/email/)
    await expect(page.getByRole('heading', { name: 'Email providers' })).toBeVisible()

    await page.getByRole('link', { name: 'Third-party APIs' }).click()
    await expect(page).toHaveURL(/\/app\/settings\/third-party/)
    await expect(page.getByRole('heading', { name: 'Third-party APIs' })).toBeVisible()

    await page.getByRole('link', { name: 'Logs' }).click()
    await expect(page).toHaveURL(/\/app\/settings\/logs/)
    await expect(page.getByRole('heading', { name: 'Logs' })).toBeVisible()
  })

  test('DataTable filters, columns, and page size', async ({ page }) => {
    await signIn(page)
    await page.goto('/app/access/users')
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()

    await page.getByRole('button', { name: /filters/i }).click()
    await expect(page.getByLabel('Status')).toBeVisible()
    await page.getByLabel('Status').selectOption('inactive')
    const table = page.locator('table')
    await expect(table.getByText(/jordan viewer/i)).toBeVisible()
    await expect(table.getByText(/alex admin/i)).toHaveCount(0)

    await page.getByRole('button', { name: /columns/i }).click()
    await page.getByRole('checkbox', { name: 'Email' }).uncheck()
    await expect(page.getByRole('columnheader', { name: 'Email' })).toHaveCount(0)

    await page.getByLabel('Page size').selectOption('10')
    await expect(page.getByLabel('Page size')).toHaveValue('10')
    await expect(page.getByText(/showing/i)).toBeVisible()
  })
})
