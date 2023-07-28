import { EpfFetchError, EpfFetchIdentifier } from "@/lib/epf";
import format from "date-fns/format";

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
