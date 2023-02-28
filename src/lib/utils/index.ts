export function isStringAndNotEmpty(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!value) return false;
  return true;
}

export const isTouchDevice = () =>
  "ontouchstart" in window.document.documentElement;

function isIOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

function isWebview() {
  return (
    typeof window !== "undefined" &&
    window?.navigator?.userAgent?.includes("wv")
  );
}

export function getPlatformName(
  appPlatformName?: string
): "WEBAPP" | "WEBVIEW" | "ANDROID" | "IOS" {
  if (appPlatformName === "REFYNE_ANDROID") {
    if (isIOS()) return "IOS";
    return "ANDROID";
  }
  if (isWebview()) return "WEBVIEW";
  return "WEBAPP";
}
