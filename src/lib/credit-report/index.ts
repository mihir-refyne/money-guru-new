import { UserStatus } from "../core/user";
import { getValueFromMetadata } from "../core/user-metadata";
import { fetcher } from "../fetcher";
import {
  getFromSessionStorage,
  setInSessionStorage,
} from "../storage/browserstorage";

const USER_CREDIT_REPORT_STORAGE_KEY = "__UserCreditReport";
const USER_CREDIT_SCORE_INCREMENT_EFFECT_SHOWN_STORAGE_KEY =
  "__UserCreditReportDirectAccessed";
const CORE_SERVER_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVER_BASE_URL;

// Types //
export enum CreditReportMetricRating {
  EXCELLENT = "EXCELLENT",
  VERY_GOOD = "VERY_GOOD",
  GOOD = "GOOD",
  AVERAGE = "AVERAGE",
  NEEDS_HELP = "NEEDS_HELP",
}

export interface CreditCardAccounts {
  institution: string;
  accountType: string;
  active: boolean;
  loanType: string;
  totalOnTimePayments: number;
  totalDelayedPayments: number;
  totalPayments: number;
  balance: number;
  creditLimit: number;
  creditUsed: number;
  creditUsageInPercent: string;
}

export interface LoanAccounts {
  institution: string;
  accountType: string;
  active: boolean;
  loanType: string;
  totalOnTimePayments: number;
  totalDelayedPayments: number;
  totalPayments: number;
}

export interface RetailAccountsInfo {
  creditCardAccounts: CreditCardAccounts[];
  loanAccounts: LoanAccounts[];
}

export interface ScoreValues {
  score: string;
  rating: CreditReportMetricRating;
}

export interface CumulativeMetricsForPaymentHistory {
  onTimePayments: number;
  delayedPayments: number;
  totalPayments: number;
  onTimePaymentPercentage: string;
  rating: CreditReportMetricRating;
}

export interface CumulativeMetricsForCreditUsage {
  totalCreditUsed: number;
  totalCreditLimit: number;
  totalCreditUsageInPercent: string;
  rating: CreditReportMetricRating;
}

export interface CumulativeMetricsForCreditMix {
  totalActiveCreditCards: number;
  totalActiveLoans: number;
  totalActiveSecuredLoans: number;
  totalActiveUnsecuredLoans: number;
  rating: CreditReportMetricRating;
}

export interface Enquiry {
  institution: string;
  purpose: string;
  date: string;
}

export interface CumulativeMetricsForEnquiry {
  totalEnquiries: number;
  rating: CreditReportMetricRating;
}

export interface CreditReport {
  scoreDetails: ScoreValues[];
  retailAccountsInfo: RetailAccountsInfo;
  enquiries: Enquiry[];
  metrics: {
    paymentHistory: CumulativeMetricsForPaymentHistory;
    creditUsage: CumulativeMetricsForCreditUsage;
    creditMix: CumulativeMetricsForCreditMix;
    enquiries: CumulativeMetricsForEnquiry;
  };
}

export interface CreditReportResponse {
  report: CreditReport;
  fetchedAt: string;
}

export enum CreditReportFetchError {
  USER_IS_IN_VERIFICATION_PENDING = "USER_IS_IN_VERIFICATION_PENDING",
  USER_IS_NOT_KYC_VERIFIED = "USER_IS_NOT_KYC_VERIFIED",
}

function getSessionStorageKey() {
  const userId = getValueFromMetadata("id");
  if (!userId) return USER_CREDIT_REPORT_STORAGE_KEY;
  return `${USER_CREDIT_REPORT_STORAGE_KEY}_${userId}`;
}

function runFetchCreditReportPreCheckOrThrow() {
  const userStatus = getValueFromMetadata("status");

  if (userStatus === UserStatus.REFYNE_VERIFIED) return;
  const error = new Error("Can't fetch credit score");

  if (
    userStatus === UserStatus.VERIFICATION_PENDING ||
    userStatus === UserStatus.USER_MODIFIED_VERIFICATION_PENDING
  ) {
    error.name = CreditReportFetchError.USER_IS_IN_VERIFICATION_PENDING;
    throw error;
  }
  error.name = CreditReportFetchError.USER_IS_NOT_KYC_VERIFIED;
  throw error;
}

async function fetchCreditReport(
  idToken?: string
): Promise<CreditReportResponse | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  runFetchCreditReportPreCheckOrThrow();
  const creditReport = await fetcher<CreditReportResponse>(
    `${CORE_SERVER_BASE_URL}/credit-bureau/credit-report`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return creditReport.data;
}

export function isCreditReportThereInSessionStorage(): boolean {
  return !!getFromSessionStorage(getSessionStorageKey());
}

export async function getOrFetchCreditReport(
  idToken?: string
): Promise<CreditReportResponse | null> {
  const creditReportRawFromStorage = getFromSessionStorage(
    getSessionStorageKey()
  );
  try {
    if (creditReportRawFromStorage) {
      return JSON.parse(creditReportRawFromStorage) as CreditReportResponse;
    }
  } catch (_) {}
  const creditReport = await fetchCreditReport(idToken);
  if (!creditReport) return null;
  setInSessionStorage(getSessionStorageKey(), JSON.stringify(creditReport));
  return creditReport;
}

export function isCreditScoreIncrementEffectShown(): boolean {
  return !!getFromSessionStorage(USER_CREDIT_SCORE_INCREMENT_EFFECT_SHOWN_STORAGE_KEY);
}

export function setCreditScoreIncrementEffectShown() {
  setInSessionStorage(
    USER_CREDIT_SCORE_INCREMENT_EFFECT_SHOWN_STORAGE_KEY,
    Date.now().toString()
  );
}
