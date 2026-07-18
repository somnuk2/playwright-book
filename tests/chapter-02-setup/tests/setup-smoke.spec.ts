import { test, expect } from '@playwright/test';

test('ตรวจสอบว่า demo app พร้อมสำหรับการทดสอบ', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright Book Demo - Login/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('เข้าสู่ระบบด้วยข้อมูลตัวอย่าง', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});
