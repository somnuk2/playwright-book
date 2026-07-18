import { test, expect } from '@playwright/test';

test('form ใช้ label และ alert ที่ screen reader เข้าถึงได้', async ({ page }) => {
  await page.goto('/accessibility.html');
  await page.getByLabel('Email').fill('reader@example.com');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('alert')).toHaveText('Form submitted');
});

test('dialog มี role, accessible name และคืน focus หลังปิด', async ({ page }) => {
  await page.goto('/accessibility.html');
  const openButton = page.getByRole('button', { name: 'Open dialog' });
  await openButton.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Confirmation' })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(openButton).toBeFocused();
});

test('ปุ่มสำคัญมีขนาด target ที่เหมาะสมสำหรับการใช้งานจริง', async ({ page }) => {
  await page.goto('/accessibility.html');
  const box = await page.getByRole('button', { name: 'Open dialog' }).boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(40);
  expect(box?.width).toBeGreaterThanOrEqual(40);
});
