import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.getByTestId('cart-link').click();
  }

  async expectItem(name: string) {
    await expect(this.page.getByTestId('cart-item').filter({ hasText: name })).toBeVisible();
  }

  async checkout() {
    await this.page.getByTestId('checkout').click();
  }
}
