import EpfFetchErrorModalContentWrapper, {
  EpfFetchErrorModalContentProps,
} from "@/components/EpfTracker/EpfFetchErrorModalContent";
import EpfPendingView from "@/components/EpfTracker/EpfPendingView";
import EpfPreCheckFailedView from "@/components/EpfTracker/EpfPreCheckFailedView";
import EpfSummary from "@/components/EpfTracker/EpfSummary";
import EpfTrackerLoading from "@/components/EpfTracker/EpfTrackerLoading";
import { SERVICE_UNAVAILABLE_COMMON_MODAL } from "@/components/EpfTracker/constants";
import { isEpfFetchError } from "@/components/EpfTracker/helpers";
import Modal from "@/components/Modal";
import Redirect from "@/components/Redirect";
import useFetcher from "@/hooks/useFetcher";
import useTranslation from "@/hooks/useTranslation";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { fetchEPFTrackerServiceAvailability } from "@/lib/credit-report";
import {
  EpfDetailsResponse,
  EpfFetchDetailsStatusEnum,
  EpfFetchIdentifier,
  fetchEpfSessionStatus,
  getOrFetchEpfDetails,
} from "@/lib/epf";
import { FetcherError } from "@/lib/fetcher";
import { isObjectEmpty } from "@/lib/utils";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EpfTrackerSummaryPage() {
  const router = useRouter();
  const { data: serviceAvailability } = useFetcher(
    fetchEPFTrackerServiceAvailability,
  );

  // First fetch session status
  const {
    isLoading: isSessionStatusLoading,
    data: sessionStatusData,
    error: sessionStatusError,
  } = useFetcher(fetchEpfSessionStatus);

  // State for EPF details (fetched conditionally based on session status)
  const [epfDetailsData, setEpfDetailsData] =
    useState<EpfDetailsResponse | null>(null);
  const [isEpfDetailsLoading, setIsEpfDetailsLoading] = useState(true);
  const [epfDetailsError, setEpfDetailsError] = useState<FetcherError | null>(
    null,
  );

  const [errorModal, setErrorModal] =
    useState<EpfFetchErrorModalContentProps | null>(null);

  const { t } = useTranslation("common");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);

  const directlyAccessed = !!router.query["direct"];
  // Both the Money Guru dashboard tile and the native app's "Refyne
  // Services" PF menu item open this same screen; entry_point tells them
  // apart in analytics. Defaults to money_guru since that's the only entry
  // point that doesn't pass it explicitly today.
  const entryPoint = router.query["entry_point"]?.toString() ?? "money_guru";

  // Fetch EPF details when session status indicates we should
  useEffect(() => {
    if (!sessionStatusData || isSessionStatusLoading) return;

    const shouldFetch =
      sessionStatusData.status === EpfFetchDetailsStatusEnum.SUCCESS ||
      sessionStatusData.status === EpfFetchDetailsStatusEnum.NOT_STARTED;

    if (!shouldFetch) {
      setIsEpfDetailsLoading(false);
      return;
    }

    setIsEpfDetailsLoading(true);
    setEpfDetailsError(null);

    getOrFetchEpfDetails()
      .then((data) => {
        setEpfDetailsData(data);
      })
      .catch((error) => {
        setEpfDetailsError(error);
      })
      .finally(() => {
        setIsEpfDetailsLoading(false);
      });
  }, [sessionStatusData, isSessionStatusLoading]);

  function handleOnMount() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.EPF_DASHBOARD_SCREEN,
    );
    logMoneyGuruEvent(AnalyticEvent.PF_VIEWED, { entry_point: entryPoint });
  }

  function handlePendingViewMount() {
    logEventInMixpanel(AnalyticEvent.EPF_AUTH_SCREEN, {
      screen_type: "PENDING",
    });
  }

  function handleEpfDownModalSecondaryCtaClick() {
    setErrorModal(null);
  }

  function handleEpfDownModalPrimaryCtaClick() {
    setErrorModal(null);
    toast(t("epfo_we_will_notify_you"), {
      style: {
        background: "var(--clr-text-primary)",
        color: "var(--clr-pure-white)",
        width: "100%",
      },
      duration: 2000,
    });
  }

  function handleEstablishmentCardClick(memberId: string) {
    logEventInMixpanel(AnalyticEvent.EPF_EMPLOYER_DETAIL_CTA_CLICKED);
    router.push(`/epf-tracker/passbook?memberId=${memberId}`);
  }

  function handleEpfPreCheckFailNavigate(
    navigateTo: string,
    webviewRoute?: string,
  ) {
    // TODO: Update it if more paths added
    logEventInMixpanel(AnalyticEvent.EPF_KYC_PRECHECK_FAILED_SCREEN_CTA_CLICK, {
      cta_name: "COMPLETE_KYC",
    });
    const isWebviewInsideRefyneApp = isCurrentlyOnRefyneWebview(
      getValueFromMetadata("appPlatformName"),
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
      reason: sessionStatusError?.name || epfDetailsError?.name,
    });
  }

  function handleErrorModalClose() {
    setErrorModal(null);
  }

  function handleEpfRefetchClick(
    identifier: EpfFetchIdentifier,
    value?: string,
  ) {
    if (serviceAvailability === "UNAVAILABLE") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.EPFO_UNAVAILABLE_MODAL,
      );
      setErrorModal({
        ...SERVICE_UNAVAILABLE_COMMON_MODAL,
        closable: true,
        primaryCta: {
          label: "epfo_portal_down_cta",
          onClick: handleEpfDownModalPrimaryCtaClick,
        },
        secondaryCta: {
          label: "epfo_portal_down_secondary_cta",
          onClick: handleEpfDownModalSecondaryCtaClick,
        },
      });
      return;
    }
    logAnalyticsEvent(["mixpanel"], AnalyticEvent.EPF_REFETCH_BUTTON_CLICKED);
    router.push({
      pathname: "/epf-tracker/start",
      query: {
        identifier,
        value,
        autoSubmit: !!value,
      },
    });
  }

  function handleRouting(navigateTo: string, webviewRoute?: string) {
    if (isRefyneWebview && webviewRoute) {
      return dispatchDataToNativePlatform({
        type: "ROUTE_TO_SCREEN",
        body: {
          screenName: webviewRoute,
        },
      });
    }
    router.push(navigateTo);
  }

  function handleFAQClick() {
    const faqURL = "https://app.refyne.co.in/#/?next=%2Ffaq";
    const faqRouteId = "FAQ_PAGE";
    return handleRouting(faqURL, faqRouteId);
  }

  // Show loader while fetching session status
  if (isSessionStatusLoading) return <EpfTrackerLoading />;

  // Handle session status errors (like KYC pre-check failures)
  if (sessionStatusError) {
    if (isEpfFetchError(sessionStatusError.name)) {
      return (
        <EpfPreCheckFailedView
          error={sessionStatusError.name}
          directlyAccessed={directlyAccessed}
          onMount={handlePreFetchErrorPageMount}
          onNavigate={handleEpfPreCheckFailNavigate}
        />
      );
    }

    const errorMessage =
      getCoreServerErrorMessageFromFetcherError(sessionStatusError);
    if (errorMessage)
      toast.error(errorMessage, {
        id: "EpfTrackerSummaryPage__session_status_error",
      });
    return <Redirect to="/epf-tracker/start" />;
  }

  // Handle different session statuses
  if (sessionStatusData) {
    const { status } = sessionStatusData;

    // PENDING: Show pending view
    if (status === EpfFetchDetailsStatusEnum.PENDING) {
      return (
        <EpfPendingView
          directlyAccessed={directlyAccessed}
          onMount={handlePendingViewMount}
        />
      );
    }

    // FAILED: Redirect to start page
    if (status === EpfFetchDetailsStatusEnum.FAILED) {
      return <Redirect to="/epf-tracker/start" />;
    }

    // SUCCESS: Fetch and show EPF details
    if (status === EpfFetchDetailsStatusEnum.SUCCESS) {
      if (isEpfDetailsLoading) return <EpfTrackerLoading />;

      if (epfDetailsError) {
        if (isEpfFetchError(epfDetailsError.name)) {
          return (
            <EpfPreCheckFailedView
              error={epfDetailsError.name}
              directlyAccessed={directlyAccessed}
              onMount={handlePreFetchErrorPageMount}
              onNavigate={handleEpfPreCheckFailNavigate}
            />
          );
        }

        const errorMessage =
          getCoreServerErrorMessageFromFetcherError(epfDetailsError);
        if (errorMessage)
          toast.error(errorMessage, {
            id: "EpfTrackerSummaryPage__details_error",
          });
        return <Redirect to="/epf-tracker/no-record" />;
      }

      if (!epfDetailsData || isObjectEmpty(epfDetailsData)) {
        return <Redirect to="/epf-tracker/start" />;
      }

      return (
        <>
          <EpfSummary
            epfDetails={epfDetailsData}
            directlyAccessed={directlyAccessed}
            onMount={handleOnMount}
            onEstablishmentCardClick={handleEstablishmentCardClick}
            onRefetchClick={handleEpfRefetchClick}
            onFaqClick={handleFAQClick}
          />
          <Modal
            active={errorModal !== null}
            onClose={errorModal?.closable ? handleErrorModalClose : undefined}
            bottomSheetOnMobile
          >
            <EpfFetchErrorModalContentWrapper
              content={errorModal}
              onCtaClickFallback={handleErrorModalClose}
            />
          </Modal>
        </>
      );
    }

    // NOT_STARTED: Check if data exists, otherwise redirect to start
    if (status === EpfFetchDetailsStatusEnum.NOT_STARTED) {
      if (isEpfDetailsLoading) return <EpfTrackerLoading />;

      if (epfDetailsError) {
        if (isEpfFetchError(epfDetailsError.name)) {
          return (
            <EpfPreCheckFailedView
              error={epfDetailsError.name}
              directlyAccessed={directlyAccessed}
              onMount={handlePreFetchErrorPageMount}
              onNavigate={handleEpfPreCheckFailNavigate}
            />
          );
        }

        // For NOT_STARTED, if there's an error fetching, redirect to start
        return <Redirect to="/epf-tracker/start" />;
      }

      // If we have cached data, show it
      if (epfDetailsData && !isObjectEmpty(epfDetailsData)) {
        return (
          <>
            <EpfSummary
              epfDetails={epfDetailsData}
              directlyAccessed={directlyAccessed}
              onMount={handleOnMount}
              onEstablishmentCardClick={handleEstablishmentCardClick}
              onRefetchClick={handleEpfRefetchClick}
              onFaqClick={handleFAQClick}
            />
            <Modal
              active={errorModal !== null}
              onClose={errorModal?.closable ? handleErrorModalClose : undefined}
              bottomSheetOnMobile
            >
              <EpfFetchErrorModalContentWrapper
                content={errorModal}
                onCtaClickFallback={handleErrorModalClose}
              />
            </Modal>
          </>
        );
      }

      // No cached data, redirect to start
      return <Redirect to="/epf-tracker/start" />;
    }
  }

  // Fallback: redirect to start if no session status data
  return <Redirect to="/epf-tracker/start" />;
}
