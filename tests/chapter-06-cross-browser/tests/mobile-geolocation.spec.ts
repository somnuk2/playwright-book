import { test, expect, devices } from '@playwright/test';

test.describe('mobile emulation', () => {
  const { defaultBrowserType, ...pixel5 } = devices['Pixel 5'];
  test.use({
    ...pixel5,
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
    permissions: ['geolocation'],
    timezoneId: 'Asia/Bangkok'
  });

  test('อ่านค่า geolocation และ timezone ใน mobile context', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(async () => {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
      return {
        latitude: Number(position.coords.latitude.toFixed(4)),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    });
    expect(result.latitude).toBe(13.7563);
    expect(result.timezone).toBe('Asia/Bangkok');
  });
});
