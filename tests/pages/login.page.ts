import { LoginPage as BaseLoginPage } from '../chapter-04-ui-e2e/pages/LoginPage';

export class LoginPage extends BaseLoginPage {
  async goto() {
    await this.open();
  }

  async loginAsStandardUser() {
    await this.goto();
    await this.login('standard_user', 'secret_sauce');
  }
}
