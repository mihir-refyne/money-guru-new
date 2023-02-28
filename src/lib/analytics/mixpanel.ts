import mixpanel from "mixpanel-browser";

const globalProperties = new Map<string, unknown>();
export function setMixpanelGlobalProperties(key: string, value: unknown) {
  globalProperties.set(key, value);
}
export function delecteMixpanelGlobalProperties(key: string) {
  globalProperties.delete(key);
}

export function initializeMixpanel() {
  const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!mixpanelToken) return;
  mixpanel?.init(mixpanelToken, {
    debug: process.env.NODE_ENV === "development",
  });
}

export function logEventInMixpanel(eventName: string, eventData?: object) {
  // INFO: Drop Event log if user id is not set
  if (!globalProperties.has("user_id")) return;
  mixpanel?.track(
    eventName,
    Object.assign({}, Object.fromEntries(globalProperties), eventData)
  );
}

export function setUserIdInMixpanel(userId: string) {
  mixpanel?.identify(userId);
}

export function resetMixpanel() {
  mixpanel?.reset();
}
