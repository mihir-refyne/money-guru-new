import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../browser-storage/browserstorage";

const PREFERRED_LOCALE_LOCALSTORAGE_KEY = "__PreferredLocale";

export function hasPreferredLocale(): boolean {
  return !!getFromLocalStorage(PREFERRED_LOCALE_LOCALSTORAGE_KEY);
}

export function getPreferredLocale(): string | null {
  return getFromLocalStorage(PREFERRED_LOCALE_LOCALSTORAGE_KEY);
}

export function setPreferredLocale(locale: string) {
  return setInLocalStorage(PREFERRED_LOCALE_LOCALSTORAGE_KEY, locale);
}
