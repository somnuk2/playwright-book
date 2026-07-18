import { test, expect } from '@playwright/test';
import { login } from '../../shared/login';

test('บันทึก browser และ platform เป็นหลักฐานการรันทดสอบ', async ({ page, browserName }, testInfo) => {
  await login(page);
  const evidence = {
    browserName,
    project: testInfo.project.name,
    viewport: testInfo.project.use.viewport,
    userAgent: await page.evaluate(() => navigator.userAgent)
  };
  await testInfo.attach('platform-evidence.json', {
    body: JSON.stringify(evidence, null, 2),
    contentType: 'application/json'
  });
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});

test('feature detection ใช้ตรวจความสามารถของ browser ก่อนใช้เงื่อนไขเฉพาะ', async ({ page }) => {
  await login(page);
  const capabilities = await page.evaluate(() => ({
    touch: navigator.maxTouchPoints > 0,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }));
  expect(capabilities).toHaveProperty('touch');
  expect(capabilities).toHaveProperty('reducedMotion');
});

test('จำลอง network delay เฉพาะ endpoint สินค้า', async ({ page }) => {
  await page.route('/api/products', async (route) => {
    const response = await route.fetch();
    await new Promise((resolve) => setTimeout(resolve, 150));
    await route.fulfill({ response });
  });
  await login(page);
  await expect(page.getByTestId('product-card')).toHaveCount(4);
});

test('ตรวจว่า dialog ใช้ได้ในทุก browser project', async ({ page }) => {
  await login(page);
  await page.getByTestId('open-info').click();
  await expect(page.getByRole('dialog', { name: 'Product information' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Product information' })).toBeHidden();
});
