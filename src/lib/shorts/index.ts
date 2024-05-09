import { InfiniteFetcher } from "@/hooks/useInfiniteFetcher";
import { ShortsResponse } from "@/pages/api/shorts";
import { fetcher } from "../fetcher";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../storage/browserstorage";

const SHORTS_VIEW_HISTORY_LOCALSTORAGE_KEY = "__Shorts_Views";
const SHORTS_REACTION_MAP_LOCALSTORAGE_KEY = "__Shorts_Reactions";

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

export function hasShortViewHistory(): boolean {
  return !!getFromLocalStorage(SHORTS_VIEW_HISTORY_LOCALSTORAGE_KEY);
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

export type ShortReactionMap = Record<string, string>;

export function getShortReactionMap(): ShortReactionMap {
  const dataAsString = getFromLocalStorage(
    SHORTS_REACTION_MAP_LOCALSTORAGE_KEY
  );
  if (!dataAsString) return {};
  try {
    return JSON.parse(dataAsString);
  } catch (_) {
    return {};
  }
}

export function setShortReactionMap(object: ShortReactionMap): boolean {
  const currentMap = getShortReactionMap();
  const updatedMap = { ...currentMap, ...object };
  try {
    setInLocalStorage(
      SHORTS_REACTION_MAP_LOCALSTORAGE_KEY,
      JSON.stringify(updatedMap)
    );
    return true;
  } catch (_) {
    return false;
  }
}

export const shortsInfiniteFetcher: InfiniteFetcher<
  ShortsResponse["data"]
> = async (setData, setNextToken, setIsDone, nextToken) => {
  const { data } = await fetcher<ShortsResponse>("/api/shorts", {
    query: {
      ...(nextToken ? { ContinuationToken: nextToken } : {}),
    },
  });
  setData((oldData) => {
    if (Array.isArray(oldData)) {
      return [...oldData, ...data.data];
    }
    return [...data.data];
  });
  if (!data.isTruncated) {
    setIsDone(true);
  }
  setNextToken(data.NextContinuationToken);
};
