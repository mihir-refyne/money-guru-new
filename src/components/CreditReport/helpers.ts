import type {
  CreditReportAnalysis,
  CreditReportMetricRating,
} from "@/lib/credit-report";
import type { TagType } from "../Tag";
import sub from "date-fns/sub";
import format from "date-fns/format";

const CREDIT_REPORT_METRIC_RATING_TO_COLOR_MAP: Record<
  CreditReportMetricRating,
  string
> = {
  EXCELLENT: "var(--clr-info-success-dark)",
  VERY_GOOD: "var(--clr-info-success-dark)",
  GOOD: "var(--clr-info-alert-default)",
  AVERAGE: "var(--clr-info-alert-dark)",
  NEEDS_HELP: "#F57B7B",
};

const CREDIT_REPORT_METRIC_RATING_TO_TAG_TYPE: Record<
  CreditReportMetricRating,
  TagType
> = {
  EXCELLENT: "success",
  VERY_GOOD: "success-light",
  GOOD: "warning-light",
  AVERAGE: "warning",
  NEEDS_HELP: "error-light",
};

export function getColorByCreditMetricRating(
  rating: CreditReportMetricRating
): string {
  return CREDIT_REPORT_METRIC_RATING_TO_COLOR_MAP[rating];
}

export function getTagTypeByCreditMetricRating(
  rating: CreditReportMetricRating
): TagType {
  return CREDIT_REPORT_METRIC_RATING_TO_TAG_TYPE[rating];
}

// INFO: Might need to change Chart project comes up
const FETCH_ANALYSIS_FOR_LAST_N_MONTHS = 6;
const DATE_FORMAT = "yyyy-MM";
export function getCreditReportAnalysisPeriod(): { from: string; to: string } {
  const today = new Date();
  const fromDate = sub(today, { months: FETCH_ANALYSIS_FOR_LAST_N_MONTHS });
  return {
    from: format(fromDate, DATE_FORMAT),
    to: format(today, DATE_FORMAT),
  };
}

export function checkIfAnyFactorChanged(
  metricsAnalysis?: CreditReportAnalysis["metricsAnalysis"]
): boolean {
  if (!metricsAnalysis) return false;
  const { creditAccounts, creditEnquiries, creditUsage, paymentHistory } =
    metricsAnalysis;
  if (
    creditAccounts?.differenceInNewAccountsAddedFromLastFetched != null &&
    creditAccounts?.differenceInNewAccountsAddedFromLastFetched !== 0
  )
    return true;
  if (
    creditEnquiries?.differenceInCreditEnquiriesFromLastFetched != null &&
    creditEnquiries.differenceInCreditEnquiriesFromLastFetched !== 0
  )
    return true;
  if (
    creditUsage?.differenceInCreditUsageFromLastFetched != null &&
    creditUsage.differenceInCreditUsageFromLastFetched !== 0
  )
    return true;
  if (
    paymentHistory?.differenceInLatePaymentsFromLastFetched != null &&
    paymentHistory.differenceInLatePaymentsFromLastFetched !== 0
  )
    return true;
  return false;
}
