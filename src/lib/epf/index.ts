import { UserStatus } from "../core/user";
import { getValueFromMetadata } from "../core/user-metadata";
import { fetcher } from "../fetcher";
import {
  deleteFromSessionStorage,
  getFromSessionStorage,
  setInSessionStorage,
} from "../storage/browserstorage";
import { isObjectEmpty } from "../utils";
import getDate from "date-fns/getDate";
import sub from "date-fns/sub";
import setDate from "date-fns/setDate";
import add from "date-fns/add";
import isWithinInterval from "date-fns/isWithinInterval";
import { TagType } from "@/components/Tag";

export interface EpfDetailsSummary {
  currentBalance: number;
  currentEmployeeShareBalance: number;
  currentEmployerShareBalance: number;
  currentPensionBalance: number;
  dateOfJoiningInEPF?: string;
}

export enum EpfPassbookEntryType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export enum EpfPassbookEntryVariant {
  CONTRIBUTION = "CONTRIBUTION",
  INTEREST = "INTEREST",
  CLAIM = "CLAIM",
  TRANSFER = "TRANSFER",
  PENALTIES = "PENALTIES",
  UNKNOWN = "UNKNOWN",
}

export interface EpfPassbookEntry {
  transactionDate: string;
  type: EpfPassbookEntryType;
  variant: EpfPassbookEntryVariant;
  particular: string;
  employeeShare: number;
  employerShare: number;
  pensionBalance: number;
  wageMonthYear: string;
}

export interface EpfEstablishment {
  establishmentName: string;
  memberId: string;
  dateOfJoiningInEPF?: string;
  dateOfFirstTransaction?: string;
  dateOfLastTransaction?: string;
  totalEmployeeShare: number;
  totalEmployerShare: number;
  totalPensionBalance: number;
  passbookEntries: Array<EpfPassbookEntry>;
}

export interface EpfDetailsMetadata {
  uan?: string;
  mobileNo?: string;
  fetchedAt?: string;
}

export interface EpfDetailsResponse {
  summary: EpfDetailsSummary;
  establishments: Array<EpfEstablishment>;
  metadata?: EpfDetailsMetadata;
}

export interface EpfDetailsFetchOtpTriggerResponse {
  requestId: string;
  status: string;
  message?: string;
}

export type EpfFetchIdentifier = "uan" | "mobileNo";

export const EPF_SERVER_ERROR_CODE = {
  EPF_DETAILS_FETCH_NO_RECORDS_FOUND: "E74001",
  EPF_DETAILS_FETCH_MAX_RETRIES_EXCEEDED: "E74002",
  EPF_DETAILS_FETCH_MULTIPLE_RECORDS_EXISTS: "E74003",
  EPF_DETAILS_FETCH_REQUEST_EXPIRED: "E74004",
  EPF_DETAILS_FETCH_SERVICE_UNAVAILABLE: "E74005",
};

export const EPF_NO_RECORDS_FOUND_ERROR_CODES = [
  EPF_SERVER_ERROR_CODE.EPF_DETAILS_FETCH_NO_RECORDS_FOUND,
  EPF_SERVER_ERROR_CODE.EPF_DETAILS_FETCH_MULTIPLE_RECORDS_EXISTS,
];

export enum EpfFetchError {
  USER_IS_IN_VERIFICATION_PENDING = "USER_IS_IN_VERIFICATION_PENDING",
  USER_IS_NOT_KYC_VERIFIED = "USER_IS_NOT_KYC_VERIFIED",
}

export enum EpfFetchDetailsStatusEnum {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface EpfFetchSessionStatusResponse {
  status: EpfFetchDetailsStatusEnum;
  message?: string;
}

const USER_EPF_DETAILS_STORAGE_KEY = "__UserEpfDetails";
const USER_EPF_DETAILS_INCREMENT_EFFECT_SHOWN_STORAGE_KEY =
  "__UserEpfDetailsIncreemnetEffectShown";
const CORE_SERVER_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVER_BASE_URL;

function getSessionStorageKey() {
  const userId = getValueFromMetadata("id");
  if (!userId) return USER_EPF_DETAILS_STORAGE_KEY;
  return `${USER_EPF_DETAILS_STORAGE_KEY}_${userId}`;
}

export function clearEpfDetailsFromSessionStorage() {
  deleteFromSessionStorage(getSessionStorageKey());
}

function runFetchEpfPreCheckOrThrow() {
  const userStatus = getValueFromMetadata("status");

  if (userStatus === UserStatus.REFYNE_VERIFIED) return;
  const error = new Error("Can't fetch EPF");

  if (
    userStatus === UserStatus.VERIFICATION_PENDING ||
    userStatus === UserStatus.USER_MODIFIED_VERIFICATION_PENDING
  ) {
    error.name = EpfFetchError.USER_IS_IN_VERIFICATION_PENDING;
    throw error;
  }
  error.name = EpfFetchError.USER_IS_NOT_KYC_VERIFIED;
  throw error;
}

async function fetchEpfDetails(
  _idToken?: string
): Promise<EpfDetailsResponse | null> {
  const idToken = _idToken ?? getValueFromMetadata("idToken");
  if (!idToken) return null;
  runFetchEpfPreCheckOrThrow();
  const epfDetails = await fetcher<EpfDetailsResponse>(
    `${CORE_SERVER_BASE_URL}/user/epf-details`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return epfDetails.data;
}

export async function fetchEpfSessionStatus(
  _idToken?: string
): Promise<EpfFetchSessionStatusResponse> {
  const idToken = _idToken ?? getValueFromMetadata("idToken");
  if (!idToken) throw new Error("Unauthenticated Request, please login");
  runFetchEpfPreCheckOrThrow();
  const resp = await fetcher<EpfFetchSessionStatusResponse>(
    `${CORE_SERVER_BASE_URL}/user/epf-details/fetch-session-status`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return resp.data;
}

export async function triggerOtpForEpfDetailsFetch(
  type: EpfFetchIdentifier,
  value: string
): Promise<EpfDetailsFetchOtpTriggerResponse> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) throw new Error("Unauthenticated Request, please login");
  const triggerResp = await fetcher<EpfDetailsFetchOtpTriggerResponse>(
    `${CORE_SERVER_BASE_URL}/user/epf-details/send-otp?${type}=${value}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return triggerResp.data;
}

export async function verifyOtpForEpfDetailsFetch(payload: {
  requestId: string;
  otp: string;
}): Promise<unknown> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) throw new Error("Unauthenticated Request, please login");
  const resp = await fetcher(
    `${CORE_SERVER_BASE_URL}/user/epf-details/verify-otp`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      payload,
    }
  );
  return resp.data;
}

export async function getOrFetchEpfDetails(
  idToken?: string
): Promise<EpfDetailsResponse | null> {
  const epfDetailsRawFromSessionStorage = getFromSessionStorage(
    getSessionStorageKey()
  );
  try {
    if (epfDetailsRawFromSessionStorage) {
      const parsedEpfDetails = JSON.parse(
        epfDetailsRawFromSessionStorage
      ) as EpfDetailsResponse;
      if (!isObjectEmpty(parsedEpfDetails)) return parsedEpfDetails;
    }
  } catch (_) {}
  const epfDetails = await fetchEpfDetails(idToken);
  if (epfDetails === null || isObjectEmpty(epfDetails)) return null;
  setInSessionStorage(getSessionStorageKey(), JSON.stringify(epfDetails));
  return epfDetails;
}

export function isEpfDetailsIncrementEffectShown(): boolean {
  return !!getFromSessionStorage(
    USER_EPF_DETAILS_INCREMENT_EFFECT_SHOWN_STORAGE_KEY
  );
}

export function setEpfDetailsIncrementEffectShown() {
  setInSessionStorage(
    USER_EPF_DETAILS_INCREMENT_EFFECT_SHOWN_STORAGE_KEY,
    Date.now().toString()
  );
}

function getEpfRefetchEligiblePeriod(onDate: Date): {
  fromDate: Date;
  toDate: Date;
} {
  const dayOfTheMonth = getDate(onDate);
  if (dayOfTheMonth < 16) {
    const fromDate = setDate(sub(onDate, { months: 1 }), 16);
    const toDate = setDate(onDate, 15);
    return { fromDate, toDate };
  }
  const fromDate = setDate(onDate, 16);
  const toDate = setDate(add(onDate, { months: 1 }), 15);
  return { fromDate, toDate };
}

export function isEligibleForRefetchOfEpfDetails(
  onDate: Date,
  lastFetchedAt: Date
) {
  const { fromDate, toDate } = getEpfRefetchEligiblePeriod(onDate);
  const hasAlreadyFetchedInThePeriod = isWithinInterval(lastFetchedAt, {
    start: fromDate,
    end: toDate,
  });
  return !hasAlreadyFetchedInThePeriod;
}

export function getTagTypeByTransactionTypeAndVariant(
  type: EpfPassbookEntryType,
  variant: EpfPassbookEntryVariant
): TagType | null {
  if (variant === EpfPassbookEntryVariant.INTEREST) return "success-light";
  if (variant === EpfPassbookEntryVariant.CLAIM) return "warning-light";
  if (variant === EpfPassbookEntryVariant.PENALTIES) return "error";
  if (variant === EpfPassbookEntryVariant.CONTRIBUTION) return "general-light";
  if (
    variant === EpfPassbookEntryVariant.TRANSFER &&
    type === EpfPassbookEntryType.CREDIT
  )
    return "success-light";
  if (
    variant === EpfPassbookEntryVariant.TRANSFER &&
    type === EpfPassbookEntryType.DEBIT
  )
    return "warning-light";
  return null;
}
