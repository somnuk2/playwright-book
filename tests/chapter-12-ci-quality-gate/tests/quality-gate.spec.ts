import { test, expect } from '@playwright/test';
import { login } from '../../shared/login';

test('@smoke login และหน้า inventory พร้อมใช้งาน', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('product-card')).toHaveCount(4);
});

test('@smoke checkout flow สร้างหลักฐานสำหรับ quality gate', async ({ page }, testInfo) => {
  await login(page);
  await page.getByTestId('product-card').first().getByTestId('add-to-cart').click();
  await page.getByTestId('cart-link').click();
  await page.screenshot({ path: testInfo.outputPath('cart-before-checkout.png'), fullPage: true });
  await page.getByTestId('checkout').click();
  await page.getByTestId('first-name').fill('Somnuk');
  await page.getByTestId('last-name').fill('Sin');
  await page.getByTestId('postal-code').fill('10900');
  await page.getByTestId('finish').click();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order');
});
