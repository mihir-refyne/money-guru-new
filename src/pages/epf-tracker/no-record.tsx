import { useEffect } from "react";
import { useRouter } from "next/router";
import EpfRecordNotFound from "@/components/EpfTracker/EpfRecordNotFound";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

export default function EpfTrackerNoRecordPage() {
  const router = useRouter();

  useEffect(() => {
    logEventInMixpanel(AnalyticEvent.EPF_NO_RECORD_SCREEN);
  }, []);

  function handleRetryClick() {
    logEventInMixpanel(AnalyticEvent.EPF_NO_RECORD_SCREEN_CTA_CLICKED, {
      cta_name: "RETRY",
    });
    router.replace({
      pathname: "/epf-tracker/start",
      query: router.query,
    });
  }

  const directlyAccessed = !!router.query["direct"];

  return (
    <EpfRecordNotFound
      directlyAccessed={directlyAccessed}
      onRetryClick={handleRetryClick}
    />
  );
}
