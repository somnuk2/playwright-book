import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async finish(firstName: string, lastName: string, postalCode: string) {
    await this.page.getByTestId('first-name').fill(firstName);
    await this.page.getByTestId('last-name').fill(lastName);
    await this.page.getByTestId('postal-code').fill(postalCode);
    await this.page.getByTestId('finish').click();
  }

  async expectComplete() {
    await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order');
  }
}
