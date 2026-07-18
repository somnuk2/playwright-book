import { test, expect, devices } from '@playwright/test';
import { login } from '../../shared/login';

test('auto-wait รอปุ่มพร้อมใช้งานก่อนเพิ่มสินค้าเข้าตะกร้า', async ({ page }) => {
  await login(page);
  const backpack = page.getByTestId('product-card').filter({ hasText: 'Sauce Labs Backpack' });
  await backpack.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-badge')).toHaveText('1');
});

test('explicit wait ใช้ยืนยันการเปลี่ยนหน้า checkout', async ({ page }) => {
  await login(page);
  await page.getByTestId('product-card').first().getByTestId('add-to-cart').click();
  await page.getByTestId('cart-link').click();
  await Promise.all([
    page.waitForURL(/checkout\.html/),
    page.getByTestId('checkout').click()
  ]);
  await expect(page.getByRole('heading', { name: 'Customer information' })).toBeVisible();
});

test('ตรวจผล sorting Z to A จากรายการที่ผู้ใช้เห็นบน UI', async ({ page }) => {
  await login(page);
  await page.getByTestId('product-sort').selectOption('za');
  await expect(page.getByTestId('product-name').first()).toHaveText('Sauce Labs Fleece Jacket');
  const names = await page.getByTestId('product-name').allTextContents();
  const sorted = [...names].sort((a, b) => b.localeCompare(a));
  expect(names).toEqual(sorted);
});

test('parameterized login users', async ({ page }) => {
  for (const username of ['standard_user', 'problem_user']) {
    await page.goto('/');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.getByTestId('logout').click();
  }
});

test.describe('mobile viewport example', () => {
  test.skip(({ browserName }) => browserName === 'firefox', 'Firefox does not support isMobile');

  const { defaultBrowserType, ...iPhone13 } = devices['iPhone 13'];
  test.use(iPhone13);

  test('inventory page ใช้งานได้บน mobile viewport', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });
});
