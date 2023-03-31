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

export function isScreenHeightLessThan(height: number) {
  return typeof window !== "undefined" && window.screen.height < height;
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

function hasStringOnlyDigits(value: string): boolean {
  return /^-?\d+$/.test(value);
}

export function trimNumberFromStartOrEndOfSlug(
  slug: string,
  separator: string = "-"
): string {
  let _slug = slug;
  const splittedSlug = slug.split(separator);
  const startPart: string | undefined = splittedSlug[0];
  const endPart: string | undefined = splittedSlug[splittedSlug.length - 1];

  if (!!startPart && hasStringOnlyDigits(startPart)) {
    _slug = _slug.slice(startPart.length + 1);
  }

  if (!!endPart && hasStringOnlyDigits(endPart)) {
    _slug = _slug.slice(0, -endPart.length - 1);
  }
  return _slug;
}

export function getRandomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
