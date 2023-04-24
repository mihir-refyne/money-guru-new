import { useEffect } from "react";
import { useRouter } from "next/router";
import CreditReportLoading from "@/components/CreditReport/CreditReportLoading";
import CreditReportCreditUtilisation from "@/components/CreditReport/CreditReportCreditUtilisation";
import useFetcher from "@/hooks/useFetcher";
import { getOrFetchCreditReport } from "@/lib/credit-report";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

export default function CreditReportCreditUtilisationPage() {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(getOrFetchCreditReport);

  useEffect(() => {
    if (isLoading) return;
    if (error || !data) {
      router.replace("/credit-report/summary");
    }
  }, []);

  function handleRatingTagClick(rating?: string) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_RATING_TAG_CLICKED, {
      rating,
      screen_name: router.pathname.split("/").pop(),
    });
  }

  if (isLoading) return <CreditReportLoading />;

  if (!data) return null;

  return (
    <CreditReportCreditUtilisation
      creditReport={data.report}
      onRatingTagClick={handleRatingTagClick}
    />
  );
}
