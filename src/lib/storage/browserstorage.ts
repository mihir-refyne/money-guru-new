class InMemoryBrowserStorageFallback {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map<string, string>();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

const localStorage =
  typeof window !== "undefined"
    ? window.localStorage ?? new InMemoryBrowserStorageFallback()
    : new InMemoryBrowserStorageFallback();

const sessionStorage =
  typeof window !== "undefined"
    ? window.sessionStorage ?? new InMemoryBrowserStorageFallback()
    : new InMemoryBrowserStorageFallback();

export function getFromLocalStorage(key: string): string | null {
  return localStorage.getItem(key);
}

export function setInLocalStorage(key: string, value: string) {
  return localStorage.setItem(key, value);
}

export function deleteFromLocalStorage(key: string) {
  return localStorage.removeItem(key);
}

export function getFromSessionStorage(key: string): string | null {
  return sessionStorage.getItem(key);
}

export function setInSessionStorage(key: string, value: string) {
  return sessionStorage.setItem(key, value);
}

export function deleteFromSessionStorage(key: string) {
  return sessionStorage.removeItem(key);
}
