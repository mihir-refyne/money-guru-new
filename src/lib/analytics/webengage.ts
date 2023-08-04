let isUserIdSet = false;
const globalProperties = new Map<string, unknown>();
export function setWebengageGlobalProperties(key: string, value: unknown) {
  globalProperties.set(key, value);
}
export function delecteWebengageGlobalProperties(key: string) {
  globalProperties.delete(key);
}

export function initializeWebengage() {
  const webengageLicence = process.env.NEXT_PUBLIC_WEBENGAGE_LICENSE_CODE;
  if (!webengageLicence) return;
  (window as any)?.webengage.init(webengageLicence);
}

export function setUserIdInWebengage(id: string) {
  (window as any)?.webengage.user.login(id);
  isUserIdSet = true;
}
export function logEventInWebengage(eventName: string, payload?: object) {
  if (!isUserIdSet) return;
  (window as any)?.webengage.track(
    eventName,
    Object.assign({}, globalProperties, payload)
  );
}
