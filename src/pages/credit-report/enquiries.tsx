import { useEffect } from "react";
import { useRouter } from "next/router";
import CreditReportLoading from "@/components/CreditReport/CreditReportLoading";
import CreditReportCreditEnquiries from "@/components/CreditReport/CreditReportCreditEnquiries";
import useFetcher from "@/hooks/useFetcher";
import {
  getOrFetchCreditReport,
  CreditReportPendingResponse,
} from "@/lib/credit-report";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

export default function CreditReportCreditEnquiriesPage() {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(getOrFetchCreditReport);

  useEffect(() => {
    if (isLoading) return;
    if (error || !data) {
      router.replace("/credit-report/summary");
      return;
    }
    // Handle pending response - redirect to alternate number page
    if ("fetchCompleted" in data && !data.fetchCompleted) {
      const pendingResponse = data as CreditReportPendingResponse;
      const challengeData = pendingResponse.data.sendOtpChallenge;
      if (challengeData) {
        sessionStorage.setItem(
          "__CreditBureauChallenge",
          JSON.stringify({
            requestId: pendingResponse.data.requestId,
            requestContext: {
              challengeConfigGuid: challengeData.challengeConfigGuid,
              questionKey: challengeData.questionKey,
              answerKey: challengeData.answerKey,
            },
          })
        );
      }
      // Removed auto-redirect to /alternate-number
      // router.replace("/alternate-number");
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

  if (!data || "fetchCompleted" in data) return null;

  return (
    <CreditReportCreditEnquiries
      creditReport={data.report}
      onRatingTagClick={handleRatingTagClick}
    />
  );
}
