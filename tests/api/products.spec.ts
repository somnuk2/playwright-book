import { test, expect } from '@playwright/test';

test('GET /api/products returns products for book v1.0 API examples', async ({ request }) => {
  const response = await request.get('/api/products');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.products.length).toBeGreaterThan(0);
});

test('POST /api/orders creates an order for book v1.0 API examples', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: { firstName: 'Somnuk', lastName: 'Sin', postalCode: '10900', items: ['backpack'] }
  });
  expect(response.status()).toBe(201);
  await expect(response).toBeOK();
});
