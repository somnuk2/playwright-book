import { InventoryPage as BaseInventoryPage } from '../chapter-04-ui-e2e/pages/InventoryPage';

export class InventoryPage extends BaseInventoryPage {
  async addProductToCart(name: string) {
    await this.addProduct(name);
  }
}
