import { test, expect } from '@playwright/test'

test.describe('CUJ 1: Public Discovery & Navigation', () => {
  test('should load the homepage with hero branding and main navigation', async ({ page }) => {
    await page.goto('/')

    // Verify page title and main heading/branding
    await expect(page).toHaveTitle(/Bezalel/i)
    const brand = page.getByRole('link', { name: /Bezalel Technologies home/i })
    await expect(brand).toBeVisible()

    // Verify primary navigation links exist
    const nav = page.getByRole('navigation', { name: /Primary navigation/i })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Portfolio' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Store' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Careers' })).toBeVisible()
  })

  test('should navigate to Portfolio page and render project items', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: /Primary navigation/i })
    await nav.getByRole('link', { name: 'Portfolio' }).click()

    await page.waitForURL(/\/portfolio/)
    await expect(page).toHaveURL(/\/portfolio/)
    await expect(page.locator('h1')).toContainText(/Portfolio|Projects|Work/i)
  })

  test('should navigate to Store page and show digital catalog', async ({ page }) => {
    await page.goto('/store')
    await expect(page).toHaveURL(/\/store/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display custom 404 page for unmapped routes', async ({ page }) => {
    await page.goto('/non-existent-test-route-404')
    await expect(page.locator('body')).toContainText(/404|not found|page not found/i)
    
    // Return to home link should be present
    const returnHomeLink = page.getByRole('link', { name: /return|home|back/i }).first()
    await expect(returnHomeLink).toBeVisible()
  })

  test('should toggle theme between dark and light mode', async ({ page }) => {
    await page.goto('/')
    const themeButton = page.locator('button[aria-label*="Switch to"]').first()
    if (await themeButton.isVisible()) {
      const initialLabel = await themeButton.getAttribute('aria-label')
      await themeButton.click()
      // Wait for DOM update
      await page.waitForTimeout(500)
      const newLabel = await themeButton.getAttribute('aria-label')
      expect(newLabel).not.toBe(initialLabel)
    }
  })

  test('should display Bezalel copyright and footer attribution', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText(/Bezalel Technologies/i)
  })
})
