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

interface CreditScoresAnalytics {
  score: string;
  rating: CreditReportMetricRating;
  fetchedAt: string;
  differenceFromLastFetchedScore: number | null;
}

export enum CreditBureauVendor {
  EXPERIAN = "EXPERIAN",
  EQUIFAX = "EQUIFAX",
  CIBIL = "CIBIL",
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
  vendor: CreditBureauVendor;
  lenderId: string;
  fetchedAt: string;
  expiresAt: string;
  hasExpired: boolean;
  isConsumerNotFound?: boolean;
}

export interface CreditReportMetadataResponse {
  fetchedAt: string;
  expiresAt: string;
  hasExpired: boolean;
}

export interface CreditReportAnalysis {
  creditScoresAnalysis: Array<CreditScoresAnalytics>;
  metricsAnalysis: {
    comparisionPeriod: {
      fromDate: string | null;
      tillDate: string;
    } | null;
    paymentHistory: {
      onTimePayments: number;
      totalPayments: number;
      onTimePaymentPercentage: string;
      differenceInLatePaymentsFromLastFetched: number | null;
    } | null;
    creditAccounts: {
      totalAccounts: number;
      differenceInNewAccountsAddedFromLastFetched: number | null;
    } | null;
    creditUsage: {
      totalCreditUsageInPercent: string;
      differenceInCreditUsageFromLastFetched: number | null;
    } | null;
    creditEnquiries: {
      totalEnquiries: number;
      differenceInCreditEnquiriesFromLastFetched: number | null;
    } | null;
  };
}

export interface CreditConsentStatus {
  expiresAt: string;
  valid: boolean;
}

export interface CreditReportWithAnalysis extends CreditReportResponse {
  analysis?: CreditReportAnalysis;
}

export interface CreditReportAnalysisPendingResponse {
  fetchCompleted: false;
  vendor?: CreditBureauVendor;
  data: {
    requestId: string | null;
    status: CreditBureauFetchStatusEnum;
    reason: string | null;
    sendOtpChallenge?: SendOtpChallenge;
  };
}

export interface CreditReportAnalysisCompletedResponse {
  fetchCompleted: true;
  data: CreditReportAnalysis;
}

export type CreditReportAnalysisApiResponse =
  | CreditReportAnalysisPendingResponse
  | CreditReportAnalysisCompletedResponse;

export enum CreditReportFetchError {
  USER_IS_IN_VERIFICATION_PENDING = "USER_IS_IN_VERIFICATION_PENDING",
  USER_IS_NOT_KYC_VERIFIED = "USER_IS_NOT_KYC_VERIFIED",
}

export enum CreditBureauFetchStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REQUIRES_OTP = "REQUIRES_OTP",
}

export interface SendOtpChallenge {
  challengeConfigGuid: string;
  questionKey: string;
  answerKey: string;
  challengeText?: string;
  isResendEligible?: boolean;
  expiresAt: string;
}

export interface VerifyOtpChallenge {
  challengeConfigGuid: string;
  questionKey: string;
  answerKey: string;
  challengeText?: string;
  isResendEligible?: boolean;
  expiresAt: string;
}

export interface SendOtpPendingResponse {
  fetchCompleted: false;
  data: {
    requestId: string | null;
    status: CreditBureauFetchStatusEnum;
    reason: string | null;
    verifyOtpChallenge?: VerifyOtpChallenge;
  };
}

export interface SendOtpCompletedResponse {
  fetchCompleted: true;
  data: CreditReportResponse;
}

export type SendOtpResponse = SendOtpPendingResponse | SendOtpCompletedResponse;

export interface VerifyOtpPendingResponse {
  fetchCompleted: false;
}

export interface VerifyOtpCompletedResponse {
  fetchCompleted: true;
  data: CreditReportResponse;
}

export type VerifyOtpResponse =
  | VerifyOtpPendingResponse
  | VerifyOtpCompletedResponse;

export interface CreditReportPendingResponse {
  fetchCompleted: false;
  vendor?: CreditBureauVendor;
  data: {
    requestId: string | null;
    status: CreditBureauFetchStatusEnum;
    reason: string | null;
    sendOtpChallenge?: SendOtpChallenge;
  };
}

export interface CreditReportCompletedResponse {
  fetchCompleted: true;
  data: CreditReportResponse;
}

export type CreditReportApiResponse =
  | CreditReportPendingResponse
  | CreditReportCompletedResponse;

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
  cachePreferred: boolean,
  idToken?: string,
): Promise<CreditReportResponse | CreditReportPendingResponse | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  runFetchCreditReportPreCheckOrThrow();
  const creditReport = await fetcher<CreditReportApiResponse>(
    `${CORE_SERVER_BASE_URL}/credit-bureau/credit-report?cachePreferred=${cachePreferred}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );
  const response = creditReport.data;
  if (!response.fetchCompleted) {
    return response as CreditReportPendingResponse;
  }
  return (response as CreditReportCompletedResponse).data;
}

export async function fetchEPFTrackerServiceAvailability(
  idToken?: string,
): Promise<"AVAILABLE" | "UNAVAILABLE" | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;

  const response = await fetcher<{ status: "AVAILABLE" | "UNAVAILABLE" }>(
    `${CORE_SERVER_BASE_URL}/service-availability`,
    {
      query: {
        service: "EPF_TRACKER",
      },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );
  return response.data.status;
}

export async function sendOtpForCreditReport(
  vendor: CreditBureauVendor,
  requestId: string,
  alternateMobileNumber: string,
  requestContext: {
    challengeConfigGuid: string;
    questionKey: string;
    answerKey: string;
  },
  idToken?: string,
): Promise<SendOtpResponse | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;

  const response = await fetcher<SendOtpResponse>(
    `${CORE_SERVER_BASE_URL}/credit-bureau/credit-reports/send-otp`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      payload: {
        vendor,
        requestId,
        alternateMobileNumber,
        requestContext,
      },
    },
  );
  return response.data;
}

export async function verifyOtpForCreditReport(
  vendor: CreditBureauVendor,
  requestId: string,
  otp: string,
  requestContext: {
    challengeConfigGuid: string;
    questionKey: string;
    answerKey: string;
  },
  idToken?: string,
): Promise<VerifyOtpResponse | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;

  const response = await fetcher<VerifyOtpResponse>(
    `${CORE_SERVER_BASE_URL}/credit-bureau/credit-reports/verify-otp`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      payload: {
        vendor,
        requestId,
        otp,
        requestContext,
      },
    },
  );
  return response.data;
}
async function fetchCreditReportMetadata(
  idToken?: string,
): Promise<CreditReportMetadataResponse | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  runFetchCreditReportPreCheckOrThrow();
  const creditReportMetadata = await fetcher<CreditReportMetadataResponse>(
    `${CORE_SERVER_BASE_URL}/credit-bureau/credit-report/metadata`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );
  return creditReportMetadata.data;
}

async function fetchCreditReportAnalysis(
  fromMonthYear: string,
  toMonthYear: string,
  idToken?: string,
): Promise<CreditReportAnalysis | CreditReportAnalysisPendingResponse | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  runFetchCreditReportPreCheckOrThrow();
  const creditReportAnalysis = await fetcher<CreditReportAnalysisApiResponse>(
    `${CORE_SERVER_BASE_URL}/credit-bureau/credit-reports/analysis`,
    {
      query: {
        fromMonthYear,
        toMonthYear,
      },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );
  const response = creditReportAnalysis.data;
  if (!response.fetchCompleted) {
    return response as CreditReportAnalysisPendingResponse;
  }
  return (response as CreditReportAnalysisCompletedResponse).data;
}

export function isCreditReportThereInSessionStorage(): boolean {
  return !!getFromSessionStorage(getSessionStorageKey());
}

export async function getOrFetchCreditReport(
  cachePreferred: boolean = true,
): Promise<CreditReportResponse | CreditReportPendingResponse | null> {
  const creditReportRawFromStorage = getFromSessionStorage(
    getSessionStorageKey(),
  );
  try {
    if (creditReportRawFromStorage) {
      return JSON.parse(creditReportRawFromStorage) as CreditReportResponse;
    }
  } catch (_) {}
  const creditReport = await fetchCreditReport(cachePreferred);
  if (!creditReport) return null;

  // Only save completed reports to storage, not pending responses
  if (!("fetchCompleted" in creditReport)) {
    setInSessionStorage(getSessionStorageKey(), JSON.stringify(creditReport));
  }

  return creditReport;
}

export async function getOrFetchCreditReportWithAnalysis(context: {
  fromMonthYear: string;
  toMonthYear: string;
  cachePreferred: boolean;
  idToken?: string;
}): Promise<
  | CreditReportWithAnalysis
  | CreditReportPendingResponse
  | CreditReportAnalysisPendingResponse
  | null
> {
  const { fromMonthYear, toMonthYear, idToken, cachePreferred } = context;
  // INFO: We are using the same local storage key as the object is just extended
  if (cachePreferred) {
    const creditReportRawFromStorage = getFromSessionStorage(
      getSessionStorageKey(),
    );
    try {
      if (creditReportRawFromStorage) {
        const cachedReport = JSON.parse(
          creditReportRawFromStorage,
        ) as CreditReportWithAnalysis;
        // INFO: Check for new keys in cached objects
        if (cachedReport.analysis && "hasExpired" in cachedReport)
          return cachedReport;
      }
    } catch (_) {}
  }
  const creditReport = await fetchCreditReport(cachePreferred, idToken);
  if (!creditReport) return null;

  // Handle pending response - alternate number verification required
  if ("fetchCompleted" in creditReport && !creditReport.fetchCompleted) {
    return creditReport;
  }

  const creditReportAnalysis = await fetchCreditReportAnalysis(
    fromMonthYear,
    toMonthYear,
    idToken,
  ).catch(() => null);

  // Handle pending response from analysis endpoint
  if (
    creditReportAnalysis &&
    "fetchCompleted" in creditReportAnalysis &&
    !creditReportAnalysis.fetchCompleted
  ) {
    return creditReportAnalysis;
  }

  const completedReport = creditReport as CreditReportResponse;
  const creditReportWithAnalysis: CreditReportWithAnalysis = {
    ...completedReport,
    analysis: (creditReportAnalysis as CreditReportAnalysis) || undefined,
  };
  setInSessionStorage(
    getSessionStorageKey(),
    JSON.stringify(creditReportWithAnalysis),
  );
  return creditReportWithAnalysis;
}

export async function fetchCreditReportMetadataAndReportIfActive(
  idToken?: string,
): Promise<{
  metadata: CreditReportMetadataResponse;
  reportResponse: CreditReportResponse | null;
  pendingResponse?: CreditReportPendingResponse;
} | null> {
  const metadata = await fetchCreditReportMetadata(idToken);
  if (!metadata) return null;
  if (metadata.hasExpired) return { metadata, reportResponse: null };
  const response = await getOrFetchCreditReport();
  if (!response) return { metadata, reportResponse: null };
  if ("fetchCompleted" in response && !response.fetchCompleted) {
    return { metadata, reportResponse: null, pendingResponse: response };
  }
  return { metadata, reportResponse: response as CreditReportResponse };
}

export function isCreditScoreIncrementEffectShown(): boolean {
  return !!getFromSessionStorage(
    USER_CREDIT_SCORE_INCREMENT_EFFECT_SHOWN_STORAGE_KEY,
  );
}

export function setCreditScoreIncrementEffectShown() {
  setInSessionStorage(
    USER_CREDIT_SCORE_INCREMENT_EFFECT_SHOWN_STORAGE_KEY,
    Date.now().toString(),
  );
}

export interface CreditBureauChallengeContext {
  vendor: CreditBureauVendor;
  requestId: string;
  requestContext: {
    challengeConfigGuid: string;
    questionKey: string;
    answerKey: string;
  };
}

export function handlePendingCreditReportResponse(
  pendingResponse:
    | CreditReportPendingResponse
    | CreditReportAnalysisPendingResponse,
): CreditBureauChallengeContext | null {
  const challengeData = pendingResponse.data.sendOtpChallenge;
  if (!challengeData) return null;

  const requestId = pendingResponse.data.requestId;
  if (!requestId) {
    console.error("Missing requestId in pending response");
    return null;
  }

  const vendor = pendingResponse.vendor || CreditBureauVendor.CIBIL; // Default to CIBIL if not provided

  const context: CreditBureauChallengeContext = {
    vendor,
    requestId,
    requestContext: {
      challengeConfigGuid: challengeData.challengeConfigGuid,
      questionKey: challengeData.questionKey,
      answerKey: challengeData.answerKey,
    },
  };

  sessionStorage.setItem("__CreditBureauChallenge", JSON.stringify(context));
  return context;
}

export function isAlternateNumberVerificationPending(
  data: unknown,
): data is CreditReportPendingResponse | CreditReportAnalysisPendingResponse {
  return (
    data !== null &&
    typeof data === "object" &&
    "fetchCompleted" in data &&
    data.fetchCompleted === false &&
    "data" in data &&
    typeof data.data === "object" &&
    data.data !== null &&
    "sendOtpChallenge" in data.data
  );
}

export async function getCreditBureauConsent(): Promise<boolean> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return false;
  runFetchCreditReportPreCheckOrThrow();
  const creditConsentStatus = await fetcher<CreditConsentStatus>(
    `${CORE_SERVER_BASE_URL}/credit-bureau/consent-status/pull`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );
  return creditConsentStatus?.data?.valid ?? false;
}
