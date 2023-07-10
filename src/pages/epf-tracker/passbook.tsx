import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import EpfPassbook from "@/components/EpfTracker/EpfPassbook";
import LoadingPage from "@/components/LoadingPage";
import Redirect from "@/components/Redirect";
import useFetcher from "@/hooks/useFetcher";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import { EpfEstablishment, getOrFetchEpfDetails } from "@/lib/epf";
import { useRouter } from "next/router";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

export default function EpfTrackerPassbook() {
  const router = useRouter();
  const memberId = router.query.memberId;
  const { isLoading, data, error } = useFetcher(getOrFetchEpfDetails);

  const establishmentDetails = useMemo(
    () => getEstablishmentDetails(data?.establishments, memberId?.toString()),
    [data?.establishments, memberId]
  );

  useEffect(() => {
    if (!establishmentDetails) return;
    logEventInMixpanel(AnalyticEvent.EPF_EMPLOYER_DETAIL_PAGE);
  }, [establishmentDetails]);

  // TODO: Update loader if required
  if (isLoading) return <LoadingPage />;

  if (error) {
    const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
    if (errorMessage)
      toast.error(errorMessage, { id: "EpfTrackerPassbook__error" });
    return <Redirect to="/epf-tracker/no-record" />;
  }

  if (!establishmentDetails) {
    return <Redirect to="/epf-tracker/start" />;
  }

  return <EpfPassbook establishmentDetails={establishmentDetails} />;
}

function getEstablishmentDetails(
  establishments: Array<EpfEstablishment> | undefined,
  memberId?: string
): EpfEstablishment | null {
  if (!establishments || !memberId) return null;
  const establishment = establishments.find(
    (elem) => elem.memberId === memberId
  );
  if (!establishment) return null;
  return establishment;
}
