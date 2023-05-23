import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../storage/browserstorage";

const PREFERRED_LOCALE_LOCALSTORAGE_KEY = "__PreferredLocale";

export function getPreferredLocale(): string | null {
  return getFromLocalStorage(PREFERRED_LOCALE_LOCALSTORAGE_KEY);
}

export function getOrUpdatePreferredLocale(
  context: { defaultLocale?: string; selectedLocale?: string } = {}
): string | undefined {
  const preferredLocale = getPreferredLocale();
  if (preferredLocale) return preferredLocale;
  const { defaultLocale, selectedLocale } = context;
  const locale = selectedLocale ?? defaultLocale;
  if (!locale) return;
  setPreferredLocale(locale);
  return locale;
}

export function setPreferredLocale(locale: string) {
  return setInLocalStorage(PREFERRED_LOCALE_LOCALSTORAGE_KEY, locale);
}
