import { logEventInMixpanel } from "./mixpanel";
import { logEventInPlotline } from "./plotline";
import { logEventInWebengage } from "./webengage";

type AnalyticsService = "mixpanel" | "webengage" | "plotline";
type LogEventHandler = (
  eventName: string,
  eventData?: object,
  options?: { triggerEvenIfUserContextIsAbsent?: boolean }
) => void;

const AnalyticsServiceToLogEventHandlerMap: Record<
  AnalyticsService,
  LogEventHandler
> = {
  mixpanel: logEventInMixpanel,
  webengage: logEventInWebengage,
  plotline: logEventInPlotline,
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
