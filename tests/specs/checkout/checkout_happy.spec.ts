import { test } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

test('complete checkout from the book v1.0 checkout path', async ({ page }) => {
  await new LoginPage(page).loginAsStandardUser();
  await new InventoryPage(page).addProductToCart('Sauce Labs Backpack');
  const cart = new CartPage(page);
  await cart.open();
  await cart.expectItem('Sauce Labs Backpack');
  await cart.checkout();
  const checkout = new CheckoutPage(page);
  await checkout.fillCustomer('Somnuk', 'Sin', '10900');
  await checkout.expectComplete();
});
