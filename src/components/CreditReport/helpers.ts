import type { CreditReportMetricRating } from "@/lib/credit-report";
import type { TagType } from "../Tag";

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
