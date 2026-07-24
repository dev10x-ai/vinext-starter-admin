import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173'
const againstRemote = /^https?:\/\//.test(baseURL) && !/127\.0\.0\.1|localhost/.test(baseURL)

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: againstRemote ? 120_000 : 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'on',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      // Chromium + iPhone 13–class viewport (375×667). Avoids requiring WebKit.
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        userAgent: devices['iPhone 13'].userAgent,
      },
    },
  ],
}

if (!againstRemote) {
  config.webServer = [
    {
      // App Router mock API is served by vinext at /api/* (worker/ handlers).
      command: 'npm run dev',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ]
}

export default defineConfig(config)
