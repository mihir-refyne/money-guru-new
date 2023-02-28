const globalProperties = new Map<string, unknown>();
export function setWebengageGlobalProperties(key: string, value: unknown) {
  globalProperties.set(key, value);
}
export function delecteWebengageGlobalProperties(key: string) {
  globalProperties.delete(key);
}

export function initializeWebengage() {
  const webengageLicence = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!webengageLicence) return;
  (window as any)?.webengage.init(webengageLicence);
}

export function setUserIdInWebengage(id: string) {
  (window as any)?.webengage.user.login(id);
}
export function logEventInWebengage(eventName: string, payload?: object) {
  (window as any)?.webengage.track(
    eventName,
    Object.assign({}, globalProperties, payload)
  );
}
