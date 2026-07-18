import { test, expect } from '@playwright/test';
import { loginAsStandardUser, addBackpackToCart } from '../helpers';

test('add product to cart for book v1.0 E2E examples', async ({ page }) => {
  await loginAsStandardUser(page);
  await addBackpackToCart(page);
  await page.getByTestId('cart-link').click();
  await expect(page.getByTestId('cart-item').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
});
