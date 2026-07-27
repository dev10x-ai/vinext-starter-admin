import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test'

const host = '127.0.0.1'
const port = process.env.PLAYWRIGHT_PORT ?? '5173'
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`
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
      // Prefer production start for e2e: vinext dev + Cloudflare run_worker_first
      // can race client hydration under parallel workers. Build is fast (~4s).
      // Override with PLAYWRIGHT_WEB_SERVER=npm run dev for local DX.
      // PLAYWRIGHT_PORT avoids clashes when another process already binds :5173.
      command:
        process.env.PLAYWRIGHT_WEB_SERVER ??
        `npm run build && npm run start -- -H ${host} -p ${port}`,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ]
}

export default defineConfig(config)
