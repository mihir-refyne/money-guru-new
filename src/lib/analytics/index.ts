import { logEventInMixpanel } from "./mixpanel";
import { logEventInWebengage } from "./webengage";

type AnalyticsService = "mixpanel" | "webengage";
type LogEventHandler = (eventName: string, eventData?: object) => void;

const AnalyticsServiceToLogEventHandlerMap: Record<
  AnalyticsService,
  LogEventHandler
> = {
  mixpanel: logEventInMixpanel,
  webengage: logEventInWebengage,
};

export function logAnalyticsEvent(
  services: Array<AnalyticsService>,
  ...args: Parameters<LogEventHandler>
) {
  services.forEach((service) => {
    const handler = AnalyticsServiceToLogEventHandlerMap[service];
    handler(...args);
  });
}
