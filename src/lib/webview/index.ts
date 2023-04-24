const REFYNE_ANDROID_HANDLER_NAME = "RefyneAndroid";

export interface AndroidNativeHandler {
  postMessage(message: string): void;
}

export interface NativeHandlerPayload {
  type: string;
  body?: Record<string, any>;
}

function flutterNativeDispatcher(
  handlerName: string,
  payload: NativeHandlerPayload,
  debug: boolean = false
): boolean {
  try {
    if (!(handlerName in window)) {
      throw new Error(`No handler named ${handlerName} found in window obj`);
    }
    const handler: AndroidNativeHandler = (window as any)[handlerName];
    if (typeof handler.postMessage !== "function") {
      throw new Error("`postMessage` method not available on the Handler");
    }
    const stringifiedPayload = JSON.stringify(payload);
    handler.postMessage(stringifiedPayload);
    return true;
  } catch (error) {
    if (debug) console.error(error);
    return false;
  }
}

export function dispatchDataToNativePlatform(payload: NativeHandlerPayload) {
  flutterNativeDispatcher(REFYNE_ANDROID_HANDLER_NAME, payload);

  // INFO: Add other native implementations here
}

export function isCurrentlyOnRefyneWebview(platformName?: string): boolean {
  if (!platformName) return false;
  const [normalizedPlatformName] = platformName.split(",");
  return normalizedPlatformName === "REFYNE_ANDROID";
}
