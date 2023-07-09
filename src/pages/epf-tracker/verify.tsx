import { useEffect } from "react";
import { useRouter } from "next/router";
import useMutation from "@/hooks/useMutation";
import {
  EPF_NO_RECORDS_FOUND_ERROR_CODES,
  clearEpfDetailsFromSessionStorage,
  triggerOtpForEpfDetailsFetch,
  verifyrOtpForEpfDetailsFetch,
} from "@/lib/epf";
import EpfDetailsFetchVerify from "@/components/EpfTracker/EpfDetailsFetchVerify";
import Redirect from "@/components/Redirect";
import { getEpfFetchIdentifierOrNull } from "@/components/EpfTracker/helpers";
import {
  getCoreServerErrorCodeFromFetcherError,
  getCoreServerErrorMessageFromFetcherError,
} from "@/lib/core-server";
import toast from "react-hot-toast";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";

function getOtpHintText(identifier: string, value: string): string | undefined {
  if (identifier === "uan")
    return `OTP sent to Mobile No linked with UAN: ${value}`;
  if (identifier === "mobileNo") return `OTP sent to Mobile No: ${value}`;
}

export default function EpfTrackerVerifyPage() {
  const router = useRouter();
  const requestIdFromUrlQuery = router.query.requestId?.toString();
  const messageFromUrlQuery = router.query.message?.toString();
  const identifierFromUrlQuery = router.query.identifier?.toString();
  const identifierValueFromUrlQuery = router.query.identifierValue?.toString();

  const { isLoading, data, error, mutate } = useMutation(
    verifyrOtpForEpfDetailsFetch
  );
  const otpTriggerMutation = useMutation(triggerOtpForEpfDetailsFetch);

  useEffect(() => {
    if (!identifierFromUrlQuery) return;
    logEventInMixpanel(AnalyticEvent.EPF_OTP_SCREEN, {
      auth_method: identifierFromUrlQuery,
    });
  }, [identifierFromUrlQuery]);

  useEffect(() => {
    const otpTriggerError = otpTriggerMutation.error;
    const errorMessage = getCoreServerErrorMessageFromFetcherError(
      otpTriggerError || error
    );
    if (errorMessage) toast.error(errorMessage);

    const otpVerifyErrorCode = getCoreServerErrorCodeFromFetcherError(error);
    const otpTriggerErrorCode =
      getCoreServerErrorCodeFromFetcherError(otpTriggerError);
    logEventInMixpanel(AnalyticEvent.EPF_AUTH_FAILURE, {
      screen_name: "EPF_OTP",
      error_code: otpTriggerErrorCode ?? otpVerifyErrorCode,
    });
    if (
      otpVerifyErrorCode &&
      EPF_NO_RECORDS_FOUND_ERROR_CODES.includes(otpVerifyErrorCode)
    ) {
      router.replace("/epf-tracker/no-record");
    }
  }, [error, otpTriggerMutation.error]);

  function handleSubmit(payload: { requestId: string; otp: string }) {
    logEventInMixpanel(AnalyticEvent.EPF_OTP_SCREEN_NEXT_CLICKED, {
      auth_method: identifierFromUrlQuery,
    });
    return mutate(payload);
  }

  function handleOtpResend() {
    const identifier = getEpfFetchIdentifierOrNull(identifierFromUrlQuery);
    if (!identifier || !identifierValueFromUrlQuery) return;
    logEventInMixpanel(AnalyticEvent.EPF_OTP_SCREEN_RESEND_CLICKED, {
      auth_method: identifierFromUrlQuery,
    });
    otpTriggerMutation.mutate(identifier, identifierValueFromUrlQuery);
  }

  function handleEditClick() {
    logEventInMixpanel(AnalyticEvent.EPF_OTP_SCREEN_EDIT_CLICKED, {
      auth_method: identifierFromUrlQuery,
    });
    router.replace({
      pathname: "/epf-tracker/start",
      query: {
        identifier: identifierFromUrlQuery,
        value: identifierValueFromUrlQuery,
      },
    });
  }

  if (
    !requestIdFromUrlQuery ||
    !identifierFromUrlQuery ||
    !identifierValueFromUrlQuery
  ) {
    return <Redirect to="/epf-tracker/start" />;
  }

  if (data) {
    clearEpfDetailsFromSessionStorage();
    return <Redirect to="/epf-tracker" />;
  }

  const otpSentHintMessage =
    otpTriggerMutation.data?.message ??
    messageFromUrlQuery ??
    getOtpHintText(identifierFromUrlQuery, identifierValueFromUrlQuery);
  const _isLoading = isLoading || otpTriggerMutation.isLoading;
  const requestId = otpTriggerMutation.data?.requestId ?? requestIdFromUrlQuery;

  return (
    <EpfDetailsFetchVerify
      loading={_isLoading}
      requestId={requestId}
      message={otpSentHintMessage}
      onSubmit={handleSubmit}
      onResendClick={handleOtpResend}
      onEditClick={handleEditClick}
    />
  );
}
