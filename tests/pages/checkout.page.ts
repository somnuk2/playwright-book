import { CheckoutPage as BaseCheckoutPage } from '../chapter-04-ui-e2e/pages/CheckoutPage';

export class CheckoutPage extends BaseCheckoutPage {
  async fillCustomer(firstName: string, lastName: string, postalCode: string) {
    await this.finish(firstName, lastName, postalCode);
  }
}
