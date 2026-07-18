import { test, expect } from '@playwright/test';
import { runAxeScan } from '../utils/a11y';

test('สแกนหน้า login ด้วย axe-core', async ({ page }, testInfo) => {
  await page.goto('/');
  await runAxeScan(page, testInfo, {
    tags: ['wcag2a', 'wcag2aa'],
    reportName: 'login-axe-results.json'
  });
});

test('สแกนหน้า accessibility example เฉพาะ main content', async ({ page }, testInfo) => {
  await page.goto('/accessibility.html');
  await runAxeScan(page, testInfo, {
    include: 'main',
    tags: ['wcag2a', 'wcag2aa'],
    reportName: 'accessibility-page-axe-results.json'
  });
  await expect(page.getByRole('heading', { name: 'Accessibility examples' })).toBeVisible();
});
