import {
  getFromSessionStorage,
  setInSessionStorage,
} from "../storage/browserstorage";

export interface MoneyGuruDeepLinkContext {
  sessionId?: string;
  employerId?: string;
  source: "session_qr" | "organic";
}

const MONEY_GURU_DEEP_LINK_CONTEXT_STORAGE_KEY = "__MoneyGuruDeepLinkContext";

const DEFAULT_CONTEXT: MoneyGuruDeepLinkContext = { source: "organic" };

export function setMoneyGuruDeepLinkContext(
  context: Pick<MoneyGuruDeepLinkContext, "sessionId" | "employerId">
) {
  const payload: MoneyGuruDeepLinkContext = {
    ...context,
    source: "session_qr",
  };
  setInSessionStorage(
    MONEY_GURU_DEEP_LINK_CONTEXT_STORAGE_KEY,
    JSON.stringify(payload)
  );
  return payload;
}

export function getMoneyGuruDeepLinkContext(): MoneyGuruDeepLinkContext {
  try {
    const stored = getFromSessionStorage(
      MONEY_GURU_DEEP_LINK_CONTEXT_STORAGE_KEY
    );
    if (!stored) return DEFAULT_CONTEXT;
    return JSON.parse(stored) as MoneyGuruDeepLinkContext;
  } catch (_) {
    return DEFAULT_CONTEXT;
  }
}
