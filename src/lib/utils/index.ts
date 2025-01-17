import { ONE_DAY_IN_SEC, ONE_HOUR_IN_SEC, ONE_MIN_IN_SEC } from "@/constants";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { marked } from "marked";
import { NextApiRequest } from "next";

export function isStringAndNotEmpty(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!value) return false;
  return true;
}

export const isTouchDevice = () =>
  "ontouchstart" in window.document.documentElement;

export function isIOS() {
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

export function isWebview() {
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

export function getRandomNumbersInRange(
  min: number,
  max: number,
  count: number,
  exclude: Array<number> = []
): Array<number> {
  const numbers = new Set<number>();
  while (numbers.size !== count) {
    const random = getRandomNumberInRange(min, max);
    const hasToIgnoreCurrentRandom = exclude.includes(random);
    if (!hasToIgnoreCurrentRandom) {
      numbers.add(random);
    }
  }
  return Array.from(numbers);
}

export function durationInSecondsToDayMinHrSec(durationInSec: number) {
  const days = Math.floor(durationInSec / ONE_DAY_IN_SEC);
  const remainingDurationAfterDaysInSec = durationInSec - days * ONE_DAY_IN_SEC;

  const hours = Math.floor(remainingDurationAfterDaysInSec / ONE_HOUR_IN_SEC);
  const remainingDurationAfterHoursInSec =
    remainingDurationAfterDaysInSec - hours * ONE_HOUR_IN_SEC;

  const minutes = Math.floor(remainingDurationAfterHoursInSec / ONE_MIN_IN_SEC);
  const remainingDurationAfterMinsInSec =
    remainingDurationAfterHoursInSec - minutes * ONE_MIN_IN_SEC;

  const seconds = Math.floor(remainingDurationAfterMinsInSec);

  return { days, hours, minutes, seconds };
}

export function durationInSecondsToMinSec(durationInSec: number) {
  const minutes = Math.floor(durationInSec / ONE_MIN_IN_SEC);
  const remainingDurationAfterMinsInSec =
    durationInSec - minutes * ONE_MIN_IN_SEC;

  const seconds = Math.floor(remainingDurationAfterMinsInSec);

  return { minutes, seconds };
}

export function formatToInr(amount: number, decimal?: number) {
  if (amount === null || amount === undefined) return "0";
  if (decimal) {
    return `₹ ${Number(amount.toFixed(decimal)).toLocaleString("en-IN")}`;
  }
  return `₹ ${Math.floor(amount).toLocaleString("en-IN")}`;
}

export function getAbortControllerIfAvailable(): AbortController | undefined {
  if (window.AbortController) {
    return new AbortController();
  }
}

export function convertPixelToRem(px: number): string {
  const rem = px / 10;
  return `${rem.toFixed(1)}rem`;
}

export function isObjectEmpty(
  object: object | null | undefined
): boolean | null | undefined {
  return (
    object && Object.keys(object).length === 0 && object.constructor === Object
  );
}

export function getLastItemOfArray<T>(arr: T[]): T | null {
  if (arr.length < 1) return null;
  return arr[arr.length - 1] ?? null;
}

export function getFirstItemOfArray<T>(arr: T[]): T | null {
  if (arr.length < 1) return null;
  return arr[0] ?? null;
}

export function isValueIsNumeric(value: string): boolean {
  return !Number.isNaN(Number(value));
}

export function isUserId(value: string): boolean {
  return value?.startsWith("USR");
}

export async function getObjectFromS3(
  client: S3Client,
  bucket: string,
  key: string
) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await client.send(command);
  return response.Body?.transformToString();
}

export function queryParamsParser(query: NextApiRequest["query"]) {
  let parsedQuery = { ...query };

  for (const key in parsedQuery) {
    if (Array.isArray(parsedQuery[key])) {
      parsedQuery[key] = query[key]?.[0];
    }
  }

  return parsedQuery as Record<string, string>;
}

export async function listObjectsV2(
  input: ListObjectsV2CommandInput,
  client: S3Client
) {
  try {
    const command = new ListObjectsV2Command(input);
    return await client.send(command);
  } catch (error) {
    const errorMsg = "Failed to list objects in shorts folder";
    console.error(errorMsg, error);
    return {
      error: errorMsg,
    };
  }
}

export function getHeadingFromMarkupContent(markdown: string):
  | {
      level: number;
      text: string;
    }
  | undefined {
  const renderer = new marked.Renderer();
  const headings: { level: number; text: string }[] = [];
  renderer.heading = (text, level) => {
    headings.push({ level, text });
    return "";
  };
  marked(markdown, { renderer });
  const heading = headings[0];
  return heading;
}

export function formatDate(inputDate: string): string {
  const date = new Date(inputDate);

  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours % 12 || 12;
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  return `${
    month.charAt(0).toUpperCase() + month.slice(1)
  } ${day}, ${formattedHours}:${paddedMinutes}${ampm}`;
}

export function formatDateWithYear(isoString: string): string {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
