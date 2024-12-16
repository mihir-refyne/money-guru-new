import { useSyncExternalStore } from "react";

/**
 * A custom hook for managing local storage with React's useSyncExternalStore
 * Provides a type-safe way to read, write, and subscribe to localStorage changes
 *
 * @param key - The key to use in localStorage
 * @param initialValue - The initial value to use if no value exists in localStorage
 * @returns [value, setValue] - A tuple with the current value and a setter function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Subscribe function to listen for storage changes
  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  };

  // Get snapshot from localStorage
  const getSnapshot = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  // Get server snapshot (same as getSnapshot for client-side)
  const getServerSnapshot = () => initialValue;

  // Use useSyncExternalStore to manage localStorage state
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Setter function that updates localStorage
  const setValue = (newValue: T) => {
    try {
      const valueToStore = JSON.stringify(newValue);
      localStorage.setItem(key, valueToStore);

      // Dispatch a custom event to trigger updates across hooks
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: valueToStore,
        })
      );
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  };

  return [value, setValue];
}
