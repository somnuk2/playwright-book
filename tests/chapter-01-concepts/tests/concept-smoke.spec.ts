import { test, expect } from '@playwright/test';

test('@smoke login page exposes user-facing elements', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByLabel('Username')).toBeEditable();
  await expect(page.getByLabel('Password')).toBeEditable();
  await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();
});

test('@smoke failed login produces visible feedback', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('locked_out_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByTestId('error')).toContainText('locked out');
});
