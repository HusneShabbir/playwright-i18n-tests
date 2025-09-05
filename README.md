# Playwright Localization Testing Project for RHDH

This project demonstrates how to implement and test localization (i18n) in Playwright using TypeScript. It includes a structured approach to manage different language translations and automated tests to verify localized content in the RHDH application, with special focus on ARIA compliance and UI component testing.

## Project Structure

```
my-playwright-project/
├── translations/          # Internationalization directory
│   ├── en.ts              # English translations
│   ├── fr.ts              # French translations
│   ├── de.ts              # German translations
│   └── index.ts           # Exports locale utilities
├── tests/
│   └── rhdh.spec.ts       # RHDH application tests
├── playwright.config.js    # Playwright configuration
├── e2e-i18n-guide.md      # E2E testing guide for i18n
└── README.md              # Project documentation
```

## Features

- Support for multiple languages (English, French, and German)
- Environment-based language switching
- Type-safe translation management
- Automated testing of localized content
- ARIA compliance testing
- UI component accessibility testing
- Comprehensive i18n testing guides

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

The project includes a dedicated configuration for localization testing through the `localized-smoke-suite` project.

### Running Tests with Localization

#### Default Language (English)
```bash
npx playwright test --project=localized-smoke-suite
```

#### Specific Language
```bash
TEST_LANG=fr npx playwright test --project=localized-smoke-suite
```

### Running Specific Test Files

#### Single Test File in Specific Language
```bash
TEST_LANG=fr npx playwright test tests/locale.spec.ts --project=localized-smoke-suite
TEST_LANG=fr npx playwright test tests/locale.spec.ts --project=chromium 
TEST_LANG=fr npx playwright test tests/locale.spec.ts --project=firefox 
TEST_LANG=fr npx playwright test tests/locale.spec.ts --project=webkit 
```

#### Running Specific Test Cases
```bash
# Run tests matching specific description in German
TEST_LANG=de npx playwright test tests/rhdh.spec.ts --grep "should display correct language" --project=localized-smoke-suite
```

### Running in Different Browsers

For cross-browser testing without localization:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Project Components

### 1. Internationalization (i18n)

Located in the `translations/` directory, this contains:

- `en.ts`: English translations
- `fr.ts`: French translations
- `index.ts`: Exports the locale utility functions and types

#### Translation Structure

Each language file exports an object with key-value pairs:

```typescript
// Example from en.ts
export const en = {
    "title": "Google",
    "gmailHeading": "Secure, smart, and easy to use email"
}
```

### 2. Test Configuration

The `playwright.config.js` file includes:

- Language configuration via environment variables (`TEST_LANG`)
- Dedicated localization test project configuration
- Browser-specific project configurations
- Test execution settings
- Reporter settings

#### Project Configurations

```javascript
// Example from playwright.config.js
projects: [
  {
    name: 'localized-smoke-suite',
    testMatch: '**/tests/*.spec.ts',
    use: {
      ...devices['Desktop Chrome'],
      locale: lang, // Uses TEST_LANG environment variable
    },
    retries: process.env.CI ? 2 : 0,
  },
  // Browser-specific projects
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  // ... other browser configurations
]
```

This configuration allows for:
- Dedicated localization testing with Chrome
- Flexible language switching via environment variables
- Separate browser-specific testing when needed
- Configurable retry attempts for CI environments

Key configuration for localization:
```javascript
// In playwright.config.js
use: {
  locale: lang, // Sets browser locale globally based on TEST_LANG env variable
  // ... other config options
}
```
This configuration ensures that the browser's locale is automatically set according to the `TEST_LANG` environment variable, making it seamless to test different language versions of your website.

### 3. Test Implementation

Key implementation features:
- Centralized language selection through `getCurrentLanguage()`
- Clean test implementation using utility functions
- Page object pattern implementation

The project provides utility functions in `i18n/index.ts` to handle language selection:
- `getCurrentLanguage()`: Gets the current language from environment or falls back to 'en'
- `getLocale()`: Gets translations for the current language

## Writing Tests

Example of a localized test for RHDH:

```typescript
import { test, expect } from '@playwright/test';
import { getLocale, getCurrentLanguage } from '../translations';

const lang = getCurrentLanguage();
const t = getLocale();

test.describe(`RHDH Localization - ${lang}`, () => {
  test(`should display correct language section ARIA content in ${lang}`, async ({ page }) => {
    // Navigate to settings page
    await page.goto('/settings');
    
    // Interact with UI elements
    const enterButton = page.getByRole('button', { name: 'Enter' });
    await expect(enterButton).toBeVisible();
    await enterButton.click();
    
    await page.getByRole('button', { name: 'Hide' }).click();
    
    // Verify ARIA content structure
    await expect(page.getByRole('list').first()).toMatchAriaSnapshot(`
    - listitem:
      - text: Language
      - paragraph: Change the language
    `);
    
    // Verify localized content
    await expect(page.getByTestId('select').locator('p')).toContainText(t.rhdhLanguage);
    await expect(page.getByTestId('select').locator('div')).toContainText(t.rhdhLanguage);
  });
});
```

This test demonstrates:
- Navigation to the settings page
- Role-based element selection
- ARIA snapshot validation
- Localized content verification
- UI component interaction
- Multiple selector strategies (role, test-id)

## Adding New Languages

The project currently supports English (en), French (fr), and German (de). To add support for additional languages, follow these steps:

1. Create a new language file in `i18n/` directory (e.g., `es.ts` for Spanish):
```typescript
// i18n/es.ts
export const es = {
    "rhdhLanguage": "Español",
    // Add all other required RHDH translations
};
```

2. Import and add the new language to `i18n/index.ts`:
```typescript
import { en } from './en';
import { fr } from './fr';
import { de } from './de';
import { es } from './es';  // Add import

export const locales = { 
    en, 
    fr,
    de,
    es   // Add new language
};

// No changes needed here - TypeScript will automatically update the Locale type
export type Locale = keyof typeof locales;
```

3. Run RHDH tests with the new language:
```bash
TEST_LANG=es npx playwright test rhdh.spec.ts
```

4. Best Practices for Adding Languages:
   - Ensure all RHDH-specific translation keys are present in new language files
   - Pay special attention to ARIA labels and accessibility text
   - Test language switching functionality in the RHDH settings
   - Verify correct rendering of language-specific characters
   - Test both UI components and ARIA compliance
   - Document any RTL (Right-to-Left) requirements if applicable

The existing test infrastructure will automatically handle the new language through the TypeScript type system and the `getCurrentLanguage()` utility.

## Best Practices

1. Always use translation keys instead of hardcoded strings
2. Keep translation files organized and synchronized
3. Use TypeScript for type safety
4. Run tests in all supported languages before deploying
5. Use environment variables for language configuration

## Reports

Test reports are generated in HTML format and can be found in:
- `playwright-report/`: Contains detailed test execution reports
- `test-results/`: Contains test artifacts and screenshots

