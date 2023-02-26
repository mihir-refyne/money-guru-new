import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../storage/browserstorage";

const SHORTS_VIEW_HISTORY_LOCALSTORAGE_KEY = "__Shorts_Views";

function getShortViewHistoryMap(): Record<string, string> {
  const historyAsString = getFromLocalStorage(
    SHORTS_VIEW_HISTORY_LOCALSTORAGE_KEY
  );
  if (!historyAsString) return {};
  try {
    return JSON.parse(historyAsString);
  } catch (_) {
    return {};
  }
}

function setShortViewHistoryMap(object: Record<string, string>): boolean {
  const currentMap = getShortViewHistoryMap();
  const updatedMap = { ...currentMap, ...object };
  try {
    setInLocalStorage(
      SHORTS_VIEW_HISTORY_LOCALSTORAGE_KEY,
      JSON.stringify(updatedMap)
    );
    return true;
  } catch (_) {
    return false;
  }
}

export function addShortView(shortId: string, onDate: Date = new Date()) {
  setShortViewHistoryMap({
    [shortId]: onDate.toISOString(),
  });
}

export function shortViewedAt(shortId: string): Date | null {
  const currentMap = getShortViewHistoryMap();
  const viewedAt = currentMap[shortId];
  if (!viewedAt) return null;
  try {
    return new Date(viewedAt);
  } catch (_) {
    return null;
  }
}

export function isShortViewed(shortId: string) {
  return !!shortViewedAt(shortId);
}
