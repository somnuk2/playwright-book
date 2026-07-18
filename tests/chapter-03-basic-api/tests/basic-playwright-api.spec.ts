import { test, expect } from '@playwright/test';
import { login } from '../../shared/login';

test('ใช้ locator เพื่อโต้ตอบกับฟอร์ม login', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});

test('อ่านรายการสินค้าด้วย locator และ assertion', async ({ page }) => {
  await login(page);
  const names = await page.getByTestId('product-name').allTextContents();
  expect(names).toContain('Sauce Labs Backpack');
  await expect(page.getByTestId('product-card')).toHaveCount(4);
});

test('จัดการ popup ด้วย waitForEvent', async ({ page }) => {
  await login(page);
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByTestId('terms-link').click()
  ]);
  await popup.waitForLoadState();
  await expect(popup.getByRole('heading', { name: 'Terms and conditions' })).toBeVisible();
});

test('จัดการ dialog modal ด้วย role-based locator', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Open product information' }).click();
  await expect(page.getByRole('dialog', { name: 'Product information' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog', { name: 'Product information' })).toBeHidden();
});
