import { test, expect } from '@playwright/test'

// Explicitly use an empty storage state so these tests start completely logged out
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('CUJ 2: Operator Authentication & RBAC Studio Gate', () => {
  test('unauthenticated visitor accessing /studio is redirected to /login', async ({ page }) => {
    await page.goto('/studio')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
    expect(page.url()).toContain('callbackUrl=%2Fstudio')
  })

  test('submitting invalid credentials displays access denied error toast', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.getByPlaceholder(/operator@bezalelstudio\.com/i)
    const passwordInput = page.getByPlaceholder(/••••••••••••/)
    const submitButton = page.getByRole('button', { name: /AUTHENTICATE CONSOLE/i })

    await emailInput.fill('invalid-operator@bezalelstudio.com')
    await passwordInput.fill('WrongPassword123!')
    await submitButton.click()

    // Expect error toast notification
    const errorToast = page.locator('[data-sonner-toast]').or(page.getByText(/Invalid credentials|Access denied/i))
    await expect(errorToast.first()).toBeVisible({ timeout: 8000 })
  })

  test('submitting empty email is blocked by browser validation', async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.getByPlaceholder(/operator@bezalelstudio\.com/i)
    const submitButton = page.getByRole('button', { name: /AUTHENTICATE CONSOLE/i })

    await emailInput.fill('')
    await submitButton.click()

    // Should remain on /login page
    expect(page.url()).toContain('/login')
  })

  test('valid operator credentials successfully authenticate and redirect to /studio', async ({ page }) => {
    const email = process.env.SEED_ADMIN_EMAIL || 'bezaleltechnologies047@gmail.com'
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!'

    await page.goto('/login')
    const emailInput = page.getByPlaceholder(/operator@bezalelstudio\.com/i)
    const passwordInput = page.getByPlaceholder(/••••••••••••/)
    const submitButton = page.getByRole('button', { name: /AUTHENTICATE CONSOLE/i })

    await emailInput.fill(email)
    await passwordInput.fill(password)
    await submitButton.click()

    await page.waitForURL(/\/studio/, { timeout: 15000 })
    expect(page.url()).toContain('/studio')
  })
})
