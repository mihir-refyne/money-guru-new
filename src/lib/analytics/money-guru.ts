import { getMoneyGuruDeepLinkContext } from "../core/money-guru-session";
import { logAnalyticsEvent } from ".";
import { AnalyticEvent } from "./events";

// Every Money Guru restructure event (deeplink_opened, pf_viewed,
// calculator_run, ...) carries session_id/employer_id (when present) and
// source, per the analytics spec. This wrapper attaches them so call sites
// don't have to read the deep-link context themselves every time.
export function logMoneyGuruEvent(
  event: AnalyticEvent,
  metadata?: Record<string, unknown>
) {
  const { sessionId, employerId, source } = getMoneyGuruDeepLinkContext();
  logAnalyticsEvent(["mixpanel"], event, {
    ...metadata,
    session_id: sessionId,
    employer_id: employerId,
    source,
  });
}
