import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

// Book v1.0-compatible path for the login examples.
test('standard user can log in from the book v1.0 auth path', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.loginAsStandardUser();
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});

test('locked user shows an error message from the book v1.0 auth path', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('locked_out_user', 'secret_sauce');
  await login.expectError('locked out');
});
