import { test as setup, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const authFile = path.join(__dirname, '.auth', 'admin.json')

setup('authenticate as admin operator', async ({ page }) => {
  // Ensure the .auth directory exists
  const authDir = path.dirname(authFile)
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
  }

  const email = process.env.SEED_ADMIN_EMAIL || 'bezaleltechnologies047@gmail.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!'

  await page.goto('/login')
  
  // Fill operator email and password
  const emailInput = page.getByPlaceholder(/operator@bezalelstudio\.com/i)
  await expect(emailInput).toBeVisible()
  await emailInput.fill(email)

  const passwordInput = page.getByPlaceholder(/••••••••••••/)
  await expect(passwordInput).toBeVisible()
  await passwordInput.fill(password)

  // Click authenticate button
  const submitButton = page.getByRole('button', { name: /AUTHENTICATE CONSOLE/i })
  await submitButton.click()

  // Wait for redirect to /studio
  await page.waitForURL(/\/studio/, { timeout: 15000 })
  await expect(page).toHaveURL(/\/studio/)

  // Save authenticated storage state
  await page.context().storageState({ path: authFile })
})
