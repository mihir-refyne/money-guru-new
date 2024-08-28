import { useRouter } from "next/router";
import EpfDetailsFetchStart from "@/components/EpfTracker/EpfDetailsFetchStart";
import useMutation from "@/hooks/useMutation";
import { EpfFetchIdentifier, triggerOtpForEpfDetailsFetch } from "@/lib/epf";
import Redirect from "@/components/Redirect";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import {
  getCoreServerErrorCodeFromFetcherError,
  getCoreServerErrorMessageFromFetcherError,
} from "@/lib/core-server";
import { useEffect, useState } from "react";
import { getEpfFetchIdentifierFromString } from "@/components/EpfTracker/helpers";
import toast from "react-hot-toast";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logAnalyticsEvent } from "@/lib/analytics";
import Modal from "@/components/Modal";
import EpfFetchErrorModalContentWrapper, {
  EpfFetchErrorModalContentProps,
} from "@/components/EpfTracker/EpfFetchErrorModalContent";
import { EpfTrackerServerErrorCodeToResponseModalMapPreOtp } from "@/components/EpfTracker/constants";
import { isValueIsNumeric } from "@/lib/utils";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";

export default function EpfTrackerStartPage() {
  const router = useRouter();
  const identifierFromUrlQuery = router.query.identifier;
  const valueFromUrlQuery = router.query.value?.toString();
  const autoSubmitUrlQuery = router.query.autoSubmit?.toString();
  const identifier = getEpfFetchIdentifierFromString(
    identifierFromUrlQuery?.toString()
  );
  const userMobileNo = getValueFromMetadata("mobileNo");
  const formInitialValue =
    valueFromUrlQuery ?? (identifier === "mobileNo" ? userMobileNo : undefined);
  const autoSubmit = autoSubmitUrlQuery === "true";

  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);

  const [lastFetchedIdentifierValue, setLastFetchedIdentifierValue] = useState<
    string | null
  >(null);
  const [errorModal, setErrorModal] =
    useState<EpfFetchErrorModalContentProps | null>(null);
  const { isLoading, data, error, mutate } = useMutation(
    triggerOtpForEpfDetailsFetch
  );

  useEffect(() => {
    if (
      autoSubmit &&
      valueFromUrlQuery &&
      isValueIsNumeric(valueFromUrlQuery)
    ) {
      handleTriggerOtp(identifier, valueFromUrlQuery);
    }
  }, []);

  useEffect(() => {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.EPF_AUTH_SCREEN,
      {
        auth_method: identifier,
      }
    );
  }, [identifier]);

  useEffect(() => {
    const errorCode = getCoreServerErrorCodeFromFetcherError(error);
    if (errorCode) {
      logEventInMixpanel(AnalyticEvent.EPF_AUTH_FAILURE, {
        screen_name: "EPF_AUTH",
        error_code: errorCode,
      });
    }
    const errorModalContent =
      errorCode &&
      EpfTrackerServerErrorCodeToResponseModalMapPreOtp[identifier][errorCode];
    if (errorModalContent) {
      if (errorModalContent.primaryCta?.url) {
        errorModalContent.primaryCta.onClick = handleErrorCtaClick(
          errorModalContent.primaryCta?.url
        );
      }
      setErrorModal(errorModalContent);
      return;
    }

    const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
    if (errorMessage)
      toast.error(errorMessage, { id: "EpfTrackerStartPage__error" });
  }, [error]);

  function handleErrorModalClose() {
    setErrorModal(null);
  }
  function handleErrorCtaClick(url?: string) {
    if (!url) return handleErrorModalClose;
    return () => {
      handleErrorModalClose();
      router.push(url);
    };
  }

  function handleIndetifierChange(newIdentifier: EpfFetchIdentifier) {
    const { value, autoSubmit, ...restQuery } = router.query;
    const updatedQuery = { ...restQuery, identifier: newIdentifier };
    router.replace({
      pathname: router.pathname,
      query: updatedQuery,
    });
  }

  function handleTriggerOtp(type: EpfFetchIdentifier, value: string) {
    setLastFetchedIdentifierValue(value);
    return mutate(type, value);
  }

  function handleFormSubmit(type: EpfFetchIdentifier, value: string) {
    logEventInMixpanel(AnalyticEvent.EPF_AUTH_SCREEN_NEXT_CLICKED, {
      auth_method: type,
    });
    handleTriggerOtp(type, value);
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

  if (lastFetchedIdentifierValue && data?.requestId) {
    const urlSearchQuery = new URLSearchParams();
    urlSearchQuery.set("requestId", data.requestId);
    urlSearchQuery.set("identifier", identifier);
    urlSearchQuery.set("identifierValue", lastFetchedIdentifierValue);
    if (data.message) {
      urlSearchQuery.set("message", data.message);
    }
    return (
      <Redirect
        replace={autoSubmit}
        to="/epf-tracker/verify"
        query={Object.fromEntries(urlSearchQuery.entries())}
      />
    );
  }

  const directlyAccessed = !!router.query["direct"];

  return (
    <>
      <EpfDetailsFetchStart
        key={identifier}
        identifier={identifier}
        directlyAccessed={directlyAccessed}
        initialValue={formInitialValue}
        onIdentifierChange={handleIndetifierChange}
        onSubmit={handleFormSubmit}
        loading={isLoading}
      />
      <Modal
        active={errorModal !== null}
        onClose={handleErrorModalClose}
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
