import { test, expect } from '@playwright/test';

test('programmatic login ด้วย localStorage ก่อนเปิดหน้า inventory', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('demo_user', 'standard_user');
    localStorage.setItem('cart', '[]');
  });
  await page.goto('/inventory.html');
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});

test('data setup เตรียม cart ก่อนเปิดหน้า cart', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('demo_user', 'standard_user');
    localStorage.setItem('cart', JSON.stringify(['backpack', 'bike-light']));
  });
  await page.goto('/cart.html');
  await expect(page.getByTestId('cart-item')).toHaveCount(2);
});

test('data factory ใช้สร้างข้อมูล checkout ที่เปลี่ยนได้ตามกรณีทดสอบ', async ({ page }) => {
  const customer = { firstName: 'Somnuk', lastName: 'Sin', postalCode: '10900' };
  await page.addInitScript(() => {
    localStorage.setItem('demo_user', 'standard_user');
    localStorage.setItem('cart', JSON.stringify(['backpack']));
  });
  await page.goto('/checkout.html');
  await page.getByTestId('first-name').fill(customer.firstName);
  await page.getByTestId('last-name').fill(customer.lastName);
  await page.getByTestId('postal-code').fill(customer.postalCode);
  await page.getByTestId('finish').click();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order');
});
