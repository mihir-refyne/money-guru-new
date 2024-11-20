import { getValueFromMetadata } from "@/lib/core/user-metadata";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { EpfFetchError, EpfFetchIdentifier, EpfPassbookEntry } from "@/lib/epf";
import format from "date-fns/format";
import router from "next/router";

export function getEpfServicePeriodText(context: {
  prefix?: string;
  dateOfJoiningInEPF?: string;
  dateOfExitFromEPF?: string;
  dateFormat?: string;
}): string | null {
  const {
    prefix = "",
    dateOfJoiningInEPF,
    dateOfExitFromEPF,
    dateFormat = "MMM yy",
  } = context;
  if (!dateOfJoiningInEPF) return null;
  const serviceStartMonthYear = format(
    new Date(dateOfJoiningInEPF),
    dateFormat
  );
  const serviceEndMonthYear = dateOfExitFromEPF
    ? format(new Date(dateOfExitFromEPF), dateFormat)
    : "Present";
  return `${prefix}${serviceStartMonthYear} - ${serviceEndMonthYear}`;
}

export function getEpfFetchIdentifierFromString(
  value?: string
): EpfFetchIdentifier {
  if (!value) return "mobileNo";
  if (value !== "uan" && value !== "mobileNo") return "mobileNo";
  return value as EpfFetchIdentifier;
}

export function getEpfFetchIdentifierOrNull(
  value?: string
): EpfFetchIdentifier | null {
  if (!value) return null;
  if (value !== "uan" && value !== "mobileNo") return null;
  return value as EpfFetchIdentifier;
}

export function isEpfFetchError(errorName: string): errorName is EpfFetchError {
  if (
    errorName === EpfFetchError.USER_IS_IN_VERIFICATION_PENDING ||
    errorName === EpfFetchError.USER_IS_NOT_KYC_VERIFIED
  ) {
    return true;
  }
  return false;
}

function handleRouting(navigateTo: string, webviewRoute?: string) {
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);
  if (isRefyneWebview && webviewRoute) {
    return dispatchDataToNativePlatform({
      type: "ROUTE_TO_SCREEN",
      body: {
        screenName: webviewRoute,
      },
    });
  }
  router.push(navigateTo);
}

export function redirectToFaq() {
  const faqURL =
    (process.env.NEXT_PUBLIC_APP_BASE_URL ?? "https://app.refyne.co.in") +
    "/#/?next=%2Ffaq";

  const faqRouteId = "FAQ_PAGE";
  return handleRouting(faqURL, faqRouteId);
}

export function getFinancialYearsFromPassbookEntries(
  passbookEntries: Array<EpfPassbookEntry>
): Array<{ from: Date; to: Date }> {
  const financialYears = new Map<string, { from: Date; to: Date }>();

  passbookEntries.forEach((entry) => {
    const date = new Date(entry.transactionDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Determine the financial year start
    const APRIL_INDEX = 3;
    const MARCH_INDEX = 2;

    const financialYearStart = month >= APRIL_INDEX ? year : year - 1;
    const financialYearKey = `${financialYearStart}-${financialYearStart + 1}`;

    if (!financialYears.has(financialYearKey)) {
      financialYears.set(financialYearKey, {
        from: new Date(financialYearStart, APRIL_INDEX, 1),
        to: new Date(financialYearStart + 1, MARCH_INDEX, 31),
      });
    }
  });

  return Array.from(financialYears.values());
}
