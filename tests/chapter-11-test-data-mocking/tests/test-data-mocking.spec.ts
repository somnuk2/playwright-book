import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../../shared/login';

function makeCustomer(overrides: Partial<{ firstName: string; lastName: string; postalCode: string }> = {}) {
  faker.seed(2026);
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode('#####'),
    ...overrides
  };
}

test('factory สร้างข้อมูล checkout แบบควบคุมซ้ำได้', async ({ page }) => {
  const customer = makeCustomer({ postalCode: '10900' });
  await login(page);
  await page.getByTestId('product-card').first().getByTestId('add-to-cart').click();
  await page.getByTestId('cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('first-name').fill(customer.firstName);
  await page.getByTestId('last-name').fill(customer.lastName);
  await page.getByTestId('postal-code').fill(customer.postalCode);
  await page.getByTestId('finish').click();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order');
});

test('mock empty state ของรายการสินค้า', async ({ page }) => {
  await page.route('/api/products', async (route) => {
    await route.fulfill({ json: { products: [] } });
  });
  await login(page);
  await expect(page.getByTestId('product-card')).toHaveCount(0);
});

test('mock error state ของ API สินค้า', async ({ page }) => {
  await page.route('/api/products', async (route) => {
    await route.fulfill({ status: 503, json: { message: 'Service unavailable' } });
  });
  await page.goto('/');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId('product-card')).toHaveCount(0);
});

test('mock GraphQL ProductList operation', async ({ page }) => {
  await page.route('/graphql', async (route) => {
    const payload = route.request().postDataJSON();
    if (payload.operationName === 'ProductList') {
      await route.fulfill({
        json: { data: { products: [{ id: 'mock-product', name: 'Mock Product', price: 1.23 }] } }
      });
      return;
    }
    await route.continue();
  });
  await page.goto('/');
  const body = await page.evaluate(async () => {
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ operationName: 'ProductList', variables: {} })
    });
    return res.json();
  });
  expect(body.data.products[0].name).toBe('Mock Product');
});

test('mock GraphQL AddToCart mutation', async ({ page }) => {
  await page.route('/graphql', async (route) => {
    const payload = route.request().postDataJSON();
    if (payload.operationName === 'AddToCart') {
      await route.fulfill({ json: { data: { addToCart: { ok: true, productId: payload.variables.productId } } } });
      return;
    }
    await route.continue();
  });
  await page.goto('/');
  const body = await page.evaluate(async () => {
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ operationName: 'AddToCart', variables: { productId: 'backpack' } })
    });
    return res.json();
  });
  expect(body.data.addToCart).toEqual({ ok: true, productId: 'backpack' });
});
