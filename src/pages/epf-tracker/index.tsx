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
import { isEpfFetchError } from "@/components/EpfTracker/helpers";
import EpfPreCheckFailedView from "@/components/EpfTracker/EpfPreCheckFailedView";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { getValueFromMetadata } from "@/lib/core/user-metadata";

export default function EpfTrackerSummaryPage() {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(getOrFetchEpfDetails);

  const directlyAccessed = !!router.query["direct"];

  function handleOnMount() {
    logEventInMixpanel(AnalyticEvent.EPF_DASHBOARD_SCREEN);
  }

  function handleEstablishmentCardClick(memberId: string) {
    logEventInMixpanel(AnalyticEvent.EPF_EMPLOYER_DETAIL_CTA_CLICKED);
    router.push(`/epf-tracker/passbook?memberId=${memberId}`);
  }

  function handleEpfPreCheckFailNavigate(
    navigateTo: string,
    webviewRoute?: string
  ) {
    // TODO: Update it if more paths added
    logEventInMixpanel(AnalyticEvent.EPF_KYC_PRECHECK_FAILED_SCREEN_CTA_CLICK, {
      cta_name: "COMPLETE_KYC",
    });
    const isWebviewInsideRefyneApp = isCurrentlyOnRefyneWebview(
      getValueFromMetadata("appPlatformName")
    );
    if (isWebviewInsideRefyneApp && webviewRoute) {
      return dispatchDataToNativePlatform({
        type: "ROUTE_TO_SCREEN",
        body: {
          screenName: webviewRoute,
        },
      });
    }
    router.push(navigateTo);
  }

  function handlePreFetchErrorPageMount() {
    logEventInMixpanel(AnalyticEvent.EPF_KYC_PRECHECK_FAILED_SCREEN, {
      reason: error?.name,
    });
  }

  if (isLoading) return <EpfTrackerLoading />;

  if (error) {
    if (isEpfFetchError(error.name)) {
      return (
        <EpfPreCheckFailedView
          error={error.name}
          directlyAccessed={directlyAccessed}
          onMount={handlePreFetchErrorPageMount}
          onNavigate={handleEpfPreCheckFailNavigate}
        />
      );
    }

    const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
    // INFO: Some error was coming in console please check
    if (errorMessage)
      toast.error(errorMessage, { id: "EpfTrackerSummaryPage__error" });
    return <Redirect to="/epf-tracker/no-record" />;
  }

  if (!data || isObjectEmpty(data)) {
    return <Redirect to="/epf-tracker/start" />;
  }

  return (
    <EpfSummary
      epfDetails={data}
      directlyAccessed={directlyAccessed}
      onMount={handleOnMount}
      onEstablishmentCardClick={handleEstablishmentCardClick}
    />
  );
}
