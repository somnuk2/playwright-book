import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test('sort products Z to A and add backpack to cart', async ({ page }) => {
  await new LoginPage(page).loginAsStandardUser();
  const inventory = new InventoryPage(page);
  await inventory.expectLoaded();
  await inventory.sortBy('za');
  await expect(page.getByTestId('product-name').first()).toHaveText('Sauce Labs Fleece Jacket');
  const names = await inventory.productNames();
  const sorted = [...names].sort((a, b) => b.localeCompare(a));
  expect(names).toEqual(sorted);
  await inventory.addProductToCart('Sauce Labs Backpack');
  await expect(page.getByTestId('cart-badge')).toHaveText('1');
});
