import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E configuration for Bezalel Portfolio.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Setup project for authentication storage state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // Desktop Chromium
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
    // Desktop Firefox
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      dependencies: ['setup'],
    },
    // Desktop WebKit
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      dependencies: ['setup'],
    },
    // Mobile Viewport (Pixel 7)
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 7'],
      },
      dependencies: ['setup'],
    },
    // Foldable Unfolded Viewport (~840px wide)
    {
      name: 'Foldable',
      use: {
        viewport: { width: 840, height: 1080 },
        userAgent: 'Mozilla/5.0 (Linux; Android 13; Galaxy Z Fold5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
