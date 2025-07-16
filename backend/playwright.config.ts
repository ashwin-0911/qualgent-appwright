// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // 👈 Only run tests from this folder
  timeout: 60000,
  use: {
    viewport: null,
    baseURL: 'http://bs-local.com',
  },
  projects: [
    {
      name: 'Android Chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        launchOptions: {
          args: ['--disable-notifications', '--no-sandbox'],
        },
        contextOptions: {
          permissions: ['geolocation'],
        },
      },
    },
  ],
});
