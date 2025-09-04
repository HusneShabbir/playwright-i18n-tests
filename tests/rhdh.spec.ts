import { test, expect } from '@playwright/test';
import { getLocale, getCurrentLanguage } from '../i18n';

const lang = getCurrentLanguage();
const t = getLocale();

// Run tests only for the selected language
test.describe(`RHDH Localization - ${lang}`, () => {

  test(`should display correct language section ARIA content in ${lang}`, async ({ page }) => {
    await page.goto('http://localhost:3000/settings');
    const enterButton = page.getByRole('button', { name: 'Enter' });
    await expect(enterButton).toBeVisible();
    await enterButton.click();
    await page.getByRole('button', { name: 'Hide' }).click();
    await expect(page.getByRole('list').first()).toMatchAriaSnapshot(`
    - listitem:
      - text: Language
      - paragraph: Change the language
    `);
    await expect(page.getByTestId('select').locator('p')).toContainText(t.rhdhLanguage);
    await expect(page.getByTestId('select').locator('div')).toContainText(t.rhdhLanguage);
  });

});