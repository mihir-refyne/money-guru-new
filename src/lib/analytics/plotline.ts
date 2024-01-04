function plotline(...args: Array<unknown>) {
  const plotlineHandlerFromWindow: Function | undefined = (window as any)
    .plotline;
  const debug = process.env.NODE_ENV === "development";
  if (!plotlineHandlerFromWindow) {
    if (debug) {
      console.warn("Plotline handler is not there in Window");
    }
    return;
  }
  plotlineHandlerFromWindow(...args);
}

const globalProperties = new Map<string, unknown>();
export function setPlotlineGlobalProperties(key: string, value: unknown) {
  globalProperties.set(key, value);
}
export function delectePlotlineGlobalProperties(key: string) {
  globalProperties.delete(key);
}

export function initializePlotline(userId: string) {
  const plotlineApiKey = process.env.NEXT_PUBLIC_PLOTLINE_API_KEY;
  if (!plotlineApiKey) return;
  plotline("init", plotlineApiKey, userId);
}

export function logEventInPlotline(eventName: string, eventData?: object) {
  plotline(
    "track",
    eventName,
    Object.assign({}, Object.fromEntries(globalProperties), eventData)
  );
}

export function setLocaleInPlotline(locale: string) {
  plotline("setLocale", locale);
}

export function setPlotlineEventsHandler(
  callback: (eventName: string, properties?: Record<string, unknown>) => void
) {
  plotline("setPlotlineEventsListener", callback);
}

export function resetPlotline() {
  plotline("logout");
}
