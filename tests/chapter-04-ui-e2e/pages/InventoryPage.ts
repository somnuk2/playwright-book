import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Products' })).toBeVisible();
  }

  async addProduct(name: string) {
    const card = this.page.getByTestId('product-card').filter({ hasText: name });
    await card.getByTestId('add-to-cart').click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.getByTestId('product-sort').selectOption(value);
  }

  async productNames() {
    return this.page.getByTestId('product-name').allTextContents();
  }
}
