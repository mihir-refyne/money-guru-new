import { useEffect } from "react";
import { useRouter } from "next/router";
import CreditReportLoading from "@/components/CreditReport/CreditReportLoading";
import CreditReportPaymentHistory from "@/components/CreditReport/CreditReportPaymentHistory";
import useFetcher from "@/hooks/useFetcher";
import {
  getOrFetchCreditReport,
  isAlternateNumberVerificationPending,
  handlePendingCreditReportResponse,
} from "@/lib/credit-report";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

export default function CreditReportPaymentHistoryPage() {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(getOrFetchCreditReport);

  useEffect(() => {
    if (isLoading) return;
    if (error || !data) {
      router.replace("/credit-report/summary");
      return;
    }
    // Handle pending response - redirect to alternate number page
    if (isAlternateNumberVerificationPending(data)) {
      handlePendingCreditReportResponse(data);
    }
  }, [data, error, isLoading, router]);

  function handleRatingTagClick(rating?: string) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_RATING_TAG_CLICKED, {
      rating,
      screen_name: router.pathname.split("/").pop(),
    });
  }

  const isPending = data && "fetchCompleted" in data && !data.fetchCompleted;

  if (isLoading || isPending) return <CreditReportLoading />;

  if (!data || isAlternateNumberVerificationPending(data)) return null;

  return (
    <CreditReportPaymentHistory
      creditReport={data.report}
      onRatingTagClick={handleRatingTagClick}
    />
  );
}
