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

export default function EpfTrackerStartPage() {
  const router = useRouter();
  const identifierFromUrlQuery = router.query.identifier;
  const valueFromUrlQuery = router.query.value?.toString();
  const identifier = getEpfFetchIdentifierFromString(
    identifierFromUrlQuery?.toString()
  );
  const userMobileNo = getValueFromMetadata("mobileNo");
  const formInitialValue =
    valueFromUrlQuery ?? (identifier === "mobileNo" ? userMobileNo : undefined);

  const [lastFetchedIdentifierValue, setLastFetchedIdentifierValue] = useState<
    string | null
  >(null);
  const { isLoading, data, error, mutate } = useMutation(
    triggerOtpForEpfDetailsFetch
  );

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
    const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
    if (errorMessage)
      toast.error(errorMessage, { id: "EpfTrackerStartPage__error" });
    const errorCode = getCoreServerErrorCodeFromFetcherError(error);
    if (errorCode) {
      logEventInMixpanel(AnalyticEvent.EPF_AUTH_FAILURE, {
        screen_name: "EPF_AUTH",
        error_code: errorCode,
      });
    }
  }, [error]);

  function handleIndetifierChange(newIdentifier: EpfFetchIdentifier) {
    const updatedQuery = { ...router.query, identifier: newIdentifier };
    router.replace({
      pathname: router.pathname,
      query: updatedQuery,
    });
  }

  function handleFormSubmit(type: EpfFetchIdentifier, value: string) {
    logEventInMixpanel(AnalyticEvent.EPF_AUTH_SCREEN_NEXT_CLICKED, {
      auth_method: type,
    });
    setLastFetchedIdentifierValue(value);
    return mutate(type, value);
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
        replace={false}
        to="/epf-tracker/verify"
        query={Object.fromEntries(urlSearchQuery.entries())}
      />
    );
  }

  const directlyAccessed = !!router.query["direct"];

  return (
    <EpfDetailsFetchStart
      key={identifier}
      identifier={identifier}
      directlyAccessed={directlyAccessed}
      initialValue={formInitialValue}
      onIdentifierChange={handleIndetifierChange}
      onSubmit={handleFormSubmit}
      loading={isLoading}
    />
  );
}
