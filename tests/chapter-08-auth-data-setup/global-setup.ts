import { chromium, type FullConfig } from '@playwright/test';
import path from 'node:path';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL as string;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL || 'http://127.0.0.1:4173');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.context().storageState({ path: path.join(__dirname, '.auth', 'user.json') });
  await browser.close();
}

export default globalSetup;
