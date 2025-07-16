import { test, expect } from '@playwright/test';

test('Navigate views in API Demos app', async ({ page }) => {
  // BrowserStack will launch the app by default

  // Wait for the initial activity
  await page.waitForTimeout(2000);

  // Click on "Accessibility"
  await page.locator('android.widget.TextView').filter({ hasText: 'Accessibility' }).click();

  // Click on "Accessibility Node Querying"
  await page.locator('android.widget.TextView').filter({ hasText: 'Accessibility Node Querying' }).click();

  // Expect to find "Enable TalkBack"
  await expect(page.locator('android.widget.TextView')).toContainText('Enable TalkBack');
});
