import { test, expect } from '@playwright/test';

test('GET /api/products ส่งคืนรายการสินค้า', async ({ request }) => {
  const response = await request.get('/api/products');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.products).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: 'backpack', name: 'Sauce Labs Backpack' })
  ]));
});

test('POST /api/orders สร้างคำสั่งซื้อและคืนค่า order id', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: { firstName: 'Somnuk', lastName: 'Sin', postalCode: '10900', items: ['backpack'] }
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.orderId).toMatch(/^order-/);
});

test('ตรวจ response header และ JSON shape', async ({ request }) => {
  const response = await request.get('/api/products');
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  expect(body).toEqual({ products: expect.any(Array) });
});

test('negative case สำหรับ endpoint ที่ไม่มีอยู่', async ({ request }) => {
  const response = await request.get('/api/not-found');
  expect(response.status()).toBe(404);
});
