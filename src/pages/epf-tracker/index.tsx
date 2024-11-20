import { useRouter } from "next/router";
import toast from "react-hot-toast";
import EpfSummary from "@/components/EpfTracker/EpfSummary";
import Redirect from "@/components/Redirect";
import useFetcher from "@/hooks/useFetcher";
import { EpfFetchIdentifier, getOrFetchEpfDetails } from "@/lib/epf";
import { isObjectEmpty } from "@/lib/utils";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import EpfTrackerLoading from "@/components/EpfTracker/EpfTrackerLoading";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logAnalyticsEvent } from "@/lib/analytics";
import { isEpfFetchError } from "@/components/EpfTracker/helpers";
import EpfPreCheckFailedView from "@/components/EpfTracker/EpfPreCheckFailedView";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { fetchEPFTrackerServiceAvailability } from "@/lib/credit-report";
import EpfFetchErrorModalContentWrapper, {
  EpfFetchErrorModalContentProps,
} from "@/components/EpfTracker/EpfFetchErrorModalContent";
import { useState } from "react";
import { SERVICE_UNAVAILABLE_COMMON_MODAL } from "@/components/EpfTracker/constants";
import Modal from "@/components/Modal";
import useTranslation from "@/hooks/useTranslation";

export default function EpfTrackerSummaryPage() {
  const router = useRouter();
  const { data: serviceAvailability } = useFetcher(
    fetchEPFTrackerServiceAvailability
  );
  const { isLoading, data, error } = useFetcher(getOrFetchEpfDetails);
  const [errorModal, setErrorModal] =
    useState<EpfFetchErrorModalContentProps | null>(null);

  const { t } = useTranslation("common");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);

  const directlyAccessed = !!router.query["direct"];

  function handleOnMount() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.EPF_DASHBOARD_SCREEN
    );
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

  function handleErrorModalClose() {
    setErrorModal(null);
  }

  function handleEpfRefetchClick(
    identifier: EpfFetchIdentifier,
    value?: string
  ) {
    if (serviceAvailability === "UNAVAILABLE") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.EPFO_UNAVAILABLE_MODAL
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
    <>
      <EpfSummary
        epfDetails={data}
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
