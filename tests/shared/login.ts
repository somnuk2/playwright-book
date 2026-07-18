import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function login(page: Page, username = 'standard_user', password = 'secret_sauce') {
  await page.goto('/');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);
}

export { login as loginAsStandardUser };

export async function addBackpackToCart(page: Page) {
  await page.getByRole('heading', { name: 'Sauce Labs Backpack' }).locator('..').getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-badge')).toHaveText('1');
}
