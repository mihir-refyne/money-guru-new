const inMemoryStorage = new Map<string, unknown>();

export function getFromMemoryStorage(key: string) {
  return inMemoryStorage.get(key);
}

export function setInMemoryStorage<T extends unknown>(
  key: string,
  value: T
): typeof inMemoryStorage {
  return inMemoryStorage.set(key, value);
}

export function deleteFromMemoryStorage(key: string): boolean {
  return inMemoryStorage.delete(key);
}

export function clearMemoryStorage() {
  inMemoryStorage.clear();
}
