import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('login สำเร็จและเห็นรายการสินค้า', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.open();
  await login.login('standard_user', 'secret_sauce');
  await inventory.expectLoaded();
  await expect(page.getByTestId('product-card')).toHaveCount(4);
});

test('login ไม่สำเร็จแสดง error message', async ({ page }) => {
  const login = new LoginPage(page);

  await login.open();
  await login.login('locked_out_user', 'secret_sauce');
  await login.expectError('locked out');
});

test('เลือกสินค้าและ checkout สำเร็จ', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await login.open();
  await login.login('standard_user', 'secret_sauce');
  await inventory.addProduct('Sauce Labs Backpack');
  await cart.open();
  await cart.expectItem('Sauce Labs Backpack');
  await cart.checkout();
  await checkout.finish('Somnuk', 'Sin', '10900');
  await checkout.expectComplete();
});
