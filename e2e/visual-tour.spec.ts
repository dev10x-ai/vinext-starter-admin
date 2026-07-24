import { expect, test, type Page } from '@playwright/test'
import { openMobileNavIfNeeded, signIn } from './helpers/auth'

/** Short pause so recorded videos are easier to follow. */
async function beat(page: Page, ms = 700) {
  await page.waitForTimeout(ms)
}

async function goViaSidebar(page: Page, href: string) {
  await openMobileNavIfNeeded(page)
  await page.locator(`#app-sidebar a[href="${href}"]`).click()
}

async function openUserMenu(page: Page) {
  const trigger = page.getByRole('button', { name: /open user menu/i })
  await expect(trigger).toBeVisible()
  await trigger.click()
  await expect(page.getByRole('menu')).toBeVisible()
}

async function selectAppearance(page: Page, label: 'Light' | 'System' | 'Dark') {
  const option = page.getByRole('menuitemradio', { name: label, exact: true })
  await expect(option).toBeVisible()
  await option.click()
  await expect(option).toHaveAttribute('aria-checked', 'true')
}

async function selectTheme(page: Page, name: 'Default' | 'Ruby' | 'Emerald') {
  const option = page.getByRole('menuitemradio', { name, exact: true })
  await expect(option).toBeVisible()
  await option.click()
  await expect(option).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-theme', name.toLowerCase())
}

/**
 * Dark mode + theme packs (Default → Ruby → Emerald) via the user menu.
 * Menu stays open so accent color changes are obvious on camera.
 */
async function demoDarkThemeTour(page: Page) {
  await openUserMenu(page)

  await selectAppearance(page, 'Dark')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await beat(page, 1100)

  await selectTheme(page, 'Default')
  await beat(page, 1200)

  await selectTheme(page, 'Ruby')
  await beat(page, 1200)

  await selectTheme(page, 'Emerald')
  await beat(page, 1200)

  await selectTheme(page, 'Default')
  await beat(page, 900)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  await beat(page, 500)
}

test.describe('visual tour', () => {
  test('guided walkthrough for evaluation video', async ({ page, isMobile }) => {
    // 1) Landing → login
    await page.goto('/')
    await expect(page.getByLabel('ACP').first()).toBeVisible()
    await beat(page)
    await page.getByRole('link', { name: /open console/i }).click()
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await beat(page)

    // 2) Sign in → dashboard
    await signIn(page)
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByLabel('Search')).toBeVisible()
    await beat(page, 900)

    // 3) Dark appearance + theme packs (Default → Ruby → Emerald)
    await demoDarkThemeTour(page)

    // 4) Users
    await goViaSidebar(page, '/app/access/users')
    await expect(page).toHaveURL(/\/app\/access\/users/)
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
    await beat(page)

    // 5) Design system — Typography
    await goViaSidebar(page, '/app/design-system/typography')
    await expect(page).toHaveURL(/\/app\/design-system\/typography/)
    await expect(page.getByRole('heading', { name: 'Typography', exact: true })).toBeVisible()
    await beat(page)

    // 6) Design system — Forms
    await goViaSidebar(page, '/app/design-system/forms')
    await expect(page).toHaveURL(/\/app\/design-system\/forms/)
    await expect(page.getByRole('heading', { name: 'Forms', exact: true })).toBeVisible()
    await beat(page)

    // 7) Menu tree
    await goViaSidebar(page, '/app/access/menu')
    await expect(page).toHaveURL(/\/app\/access\/menu/)
    await expect(page.getByRole('heading', { name: /menu tree/i })).toBeVisible()
    await expect(page.getByRole('tree', { name: /menu hierarchy/i })).toBeVisible()
    await beat(page)

    // 8) Platform settings
    await goViaSidebar(page, '/app/settings')
    await expect(page).toHaveURL(/\/app\/settings/)
    await expect(page.getByRole('heading', { name: /platform settings/i })).toBeVisible()
    await beat(page)

    // 9) Command palette (Cmd/Ctrl+K)
    if (isMobile) {
      await page.getByLabel('Search').click()
    } else {
      await page.evaluate(() => {
        document.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: true,
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
          }),
        )
      })
    }
    await expect(page.getByRole('dialog', { name: /search console/i })).toBeVisible()
    await beat(page, 500)
    await page.getByLabel('Search query').fill('users')
    await beat(page, 800)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: /search console/i })).toHaveCount(0)
    await beat(page, 500)
  })
})
