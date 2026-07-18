import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers';

test('@smoke login flow for book v1.0 E2E examples', async ({ page }) => {
  await loginAsStandardUser(page);
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});
