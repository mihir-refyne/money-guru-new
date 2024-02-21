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

let isFlutterInAppWebViewReady = false;
export function flutterNativeDispatcherV2Init() {
  window.addEventListener(
    "flutterInAppWebViewPlatformReady",
    function () {
      isFlutterInAppWebViewReady = true;
    },
    { once: true }
  );
}
function flutterNativeDispatcherV2<T extends Record<string, unknown>>(
  handlerName: string,
  payload: NativeHandlerPayload,
  debug?: boolean
): T | undefined {
  try {
    if (!isFlutterInAppWebViewReady) {
      throw new Error("FlutterInAppWebView is not Ready yet");
    }
    return (window as any).flutter_inappwebview.callHandler(
      handlerName,
      payload
    );
  } catch (error) {
    if (debug) console.error(error);
  }
}

export function dispatchDataToNativePlatform(payload: NativeHandlerPayload) {
  flutterNativeDispatcher(REFYNE_ANDROID_HANDLER_NAME, payload);
  flutterNativeDispatcherV2(REFYNE_ANDROID_HANDLER_NAME, payload);

  // INFO: Add other native implementations here
}

export function isCurrentlyOnRefyneWebview(platformName?: string): boolean {
  if (!platformName) return false;
  const [normalizedPlatformName] = platformName.split(",");
  return normalizedPlatformName === "REFYNE_ANDROID";
}
