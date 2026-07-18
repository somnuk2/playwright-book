import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, type TestInfo } from '@playwright/test';

type AxeOptions = {
  include?: string;
  exclude?: string;
  tags?: string[];
  reportName?: string;
  budget?: number;
};

export async function runAxeScan(page: Page, testInfo: TestInfo, options: AxeOptions = {}) {
  let builder = new AxeBuilder({ page });
  if (options.include) builder = builder.include(options.include);
  if (options.exclude) builder = builder.exclude(options.exclude);
  if (options.tags) builder = builder.withTags(options.tags);

  const results = await builder.analyze();
  await testInfo.attach(options.reportName || 'axe-results.json', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json'
  });
  expect(results.violations.length).toBeLessThanOrEqual(options.budget ?? 0);
  return results;
}
