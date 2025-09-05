import { test, expect } from '@playwright/test';
import { getLocale, getCurrentLanguage } from '../translations';

const lang = getCurrentLanguage();
const t = getLocale();

// Run tests only for the selected language
test.describe(`Google Localization - ${lang}`, () => {

  test(`should have correct title in ${lang}`, async ({ page }) => {
    await page.goto('https://www.google.com/');
    await expect(page).toHaveTitle(t.title);
  });

  test(`should open Gmail and show correct heading in ${lang}`, async ({ page }) => {
    await page.goto('https://www.google.com/');
    await page.getByRole('link', { name: /Gmail/i }).click();

    await expect(
      page.getByRole('heading', { name: t.gmailHeading })
    ).toBeVisible();
  });
});
