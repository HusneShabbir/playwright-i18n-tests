import { en } from './en';
import { fr } from './fr';
import { de } from './de';

export const locales = { en, fr, de };

export type Locale = keyof typeof locales;

export const getCurrentLanguage = (): Locale => {
  const lang = process.env.TEST_LANG || 'en';
  return lang as Locale;
};

export const getLocale = (lang: Locale = getCurrentLanguage()) => {
  return locales[lang] || locales.en;
};
