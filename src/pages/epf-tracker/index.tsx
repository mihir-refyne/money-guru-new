import { useRouter } from "next/router";
import toast from "react-hot-toast";
import EpfSummary from "@/components/EpfTracker/EpfSummary";
import Redirect from "@/components/Redirect";
import useFetcher from "@/hooks/useFetcher";
import { getOrFetchEpfDetails } from "@/lib/epf";
import { isObjectEmpty } from "@/lib/utils";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import EpfTrackerLoading from "@/components/EpfTracker/EpfTrackerLoading";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

export default function EpfTrackerSummaryPage() {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(getOrFetchEpfDetails);

  function handleOnMount() {
    logEventInMixpanel(AnalyticEvent.EPF_DASHBOARD_SCREEN);
  }

  function handleEstablishmentCardClick(memberId: string) {
    logEventInMixpanel(AnalyticEvent.EPF_EMPLOYER_DETAIL_CTA_CLICKED);
    router.push(`/epf-tracker/passbook?memberId=${memberId}`);
  }

  if (isLoading) return <EpfTrackerLoading />;

  if (error) {
    const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
    // INFO: Some error was coming in console please check
    if (errorMessage)
      toast.error(errorMessage, { id: "EpfTrackerSummaryPage__error" });
    return <Redirect to="/epf-tracker/no-record" />;
  }

  if (!data || isObjectEmpty(data)) {
    return <Redirect to="/epf-tracker/start" />;
  }

  const directlyAccessed = !!router.query["direct"];

  return (
    <EpfSummary
      epfDetails={data}
      directlyAccessed={directlyAccessed}
      onMount={handleOnMount}
      onEstablishmentCardClick={handleEstablishmentCardClick}
    />
  );
}
