import mixpanel from "mixpanel-browser";
import { isUserId } from "../utils";

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
  if (!isUserId(mixpanel?.get_distinct_id())) return;
  mixpanel?.track(
    eventName,
    Object.assign({}, Object.fromEntries(globalProperties), eventData)
  );
}

export async function logEventInMixpanelPromise(
  eventName: string,
  eventData?: object,
  config: { throwIfError?: boolean } = {}
): Promise<void> {
  // INFO: Drop Event log if user id is not set
  if (!isUserId(mixpanel?.get_distinct_id())) return;
  return new Promise((resolve, reject) => {
    mixpanel?.track(
      eventName,
      Object.assign({}, Object.fromEntries(globalProperties), eventData),
      {
        send_immediately: true,
      },
      (response) => {
        const { throwIfError = false } = config;
        if (typeof response === "number") {
          if (response === 0 && throwIfError) {
            return reject("Unknown Error");
          }
          return resolve();
        }
        if (response?.status === 0 && throwIfError) {
          return reject(response.error);
        }
        return resolve();
      }
    );
  });
}

export function setUserIdInMixpanel(userId: string) {
  mixpanel?.identify(userId);
}

export function resetMixpanel() {
  mixpanel?.reset();
}
