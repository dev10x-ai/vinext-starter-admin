import { expect, test } from '@playwright/test'
import { signIn } from './helpers/auth'

test.describe('mobile app shell', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Chrome', 'mobile viewport only')
  })

  test('drawer opens/closes, Users + modal usable, no major overflow', async ({ page }) => {
    await signIn(page)

    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    await expect(page.locator('#app-sidebar')).toHaveAttribute('data-mobile-open', 'false')

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
      }
    })
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1)

    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.locator('#app-sidebar')).toHaveAttribute('data-mobile-open', 'true')
    await expect(page.locator('#app-sidebar')).toBeInViewport()

    await page.locator('#app-sidebar a[href="/app/access/users"]').click()
    await expect(page).toHaveURL(/\/app\/access\/users/)
    await expect(page.locator('#app-sidebar')).toHaveAttribute('data-mobile-open', 'false')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.locator('#app-sidebar')).toHaveAttribute('data-mobile-open', 'true')
    await page.getByRole('button', { name: 'Collapse menu' }).click()
    await expect(page.locator('#app-sidebar')).toHaveAttribute('data-mobile-open', 'false')

    await page.getByLabel('Search').click()
    await expect(page.getByRole('dialog', { name: /search console/i })).toBeVisible()
    await page.keyboard.press('Escape')

    const userMenu = page.getByRole('button', { name: 'Open user menu' })
    await expect(userMenu).toBeVisible()
    const userBox = await userMenu.boundingBox()
    expect(userBox).toBeTruthy()
    if (userBox) {
      expect(userBox.y).toBeLessThan(56)
      expect(userBox.x + userBox.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1)
    }
    await userMenu.click()
    await expect(page.getByRole('menu')).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Appearance' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Theme' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Sign out' })).toBeVisible()
    await page.keyboard.press('Escape')

    await page.goto('/app/access/users/1/edit')
    await expect(page.getByRole('heading', { name: 'Edit user' })).toBeVisible()
    const dialogBox = page.getByRole('dialog', { name: 'Edit user' })
    await expect(dialogBox).toBeVisible()
    const box = await dialogBox.boundingBox()
    expect(box).toBeTruthy()
    if (box) {
      expect(box.width).toBeGreaterThan(300)
    }
  })
})
