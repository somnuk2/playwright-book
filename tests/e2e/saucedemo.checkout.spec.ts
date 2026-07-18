import { test, expect } from '@playwright/test';
import { loginAsStandardUser, addBackpackToCart } from '../helpers';

test('checkout flow for book v1.0 E2E examples', async ({ page }) => {
  await loginAsStandardUser(page);
  await addBackpackToCart(page);
  await page.getByTestId('cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('first-name').fill('Somnuk');
  await page.getByTestId('last-name').fill('Sin');
  await page.getByTestId('postal-code').fill('10900');
  await page.getByTestId('finish').click();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order');
});
