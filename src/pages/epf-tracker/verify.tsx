import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useMutation from "@/hooks/useMutation";
import {
  EPF_NO_RECORDS_FOUND_ERROR_CODES,
  EpfFetchIdentifier,
  clearEpfDetailsFromSessionStorage,
  triggerOtpForEpfDetailsFetch,
  verifyOtpForEpfDetailsFetch,
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
import EpfFetchErrorModalContentWrapper, {
  EpfFetchErrorModalContentProps,
} from "@/components/EpfTracker/EpfFetchErrorModalContent";
import Modal from "@/components/Modal";
import { EpfTrackerServerErrorCodeToResponseModalMapPostOtp } from "@/components/EpfTracker/constants";
import useTranslation from "@/hooks/useTranslation";
import { logAnalyticsEvent } from "@/lib/analytics";

const SHOW_SUCCESS_TOAST_AFTER_IN_MS = 500;

function getOtpHintText(identifier: string, value: string): string | undefined {
  if (identifier === "uan")
    return `OTP sent to Mobile No linked with UAN: ${value}`;
  if (identifier === "mobileNo") return `OTP sent to Mobile No: ${value}`;
}

export default function EpfTrackerVerifyPage() {
  const router = useRouter();
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const requestIdFromUrlQuery = router.query.requestId?.toString();
  const messageFromUrlQuery = router.query.message?.toString();
  const identifierFromUrlQuery = router.query.identifier?.toString();
  const identifierValueFromUrlQuery = router.query.identifierValue?.toString();

  const [errorModal, setErrorModal] =
    useState<EpfFetchErrorModalContentProps | null>(null);

  const { isLoading, data, error, mutate } = useMutation(
    verifyOtpForEpfDetailsFetch
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
    const otpVerifyErrorCode = getCoreServerErrorCodeFromFetcherError(error);
    const otpTriggerErrorCode =
      getCoreServerErrorCodeFromFetcherError(otpTriggerError);
    const errorCodeForEvent = otpTriggerErrorCode ?? otpVerifyErrorCode;
    if (errorCodeForEvent) {
      logEventInMixpanel(AnalyticEvent.EPF_AUTH_FAILURE, {
        screen_name: "EPF_OTP",
        error_code: errorCodeForEvent,
      });
    }
    if (
      otpVerifyErrorCode &&
      EPF_NO_RECORDS_FOUND_ERROR_CODES.includes(otpVerifyErrorCode)
    ) {
      router.replace("/epf-tracker/no-record");
      return;
    }
    const errorModalContent =
      errorCodeForEvent &&
      EpfTrackerServerErrorCodeToResponseModalMapPostOtp[
        identifierFromUrlQuery as EpfFetchIdentifier
      ]?.[errorCodeForEvent];
    if (errorModalContent) {
      if (errorModalContent.primaryCta?.url) {
        errorModalContent.primaryCta.onClick = handleErrorCtaClick(
          errorModalContent.primaryCta?.url
        );
      }
      setErrorModal({
        ...errorModalContent,
        ...(errorCodeForEvent === "E74005"
          ? {
              onClick: () => {
                logAnalyticsEvent(
                  ["mixpanel", "webengage"],
                  AnalyticEvent.EPFO_UNAVAILABLE_MODAL_NOTIFY_CTA_CLICKED
                );
                toast(t("epfo_we_will_notify_you"), {
                  style: {
                    background: "var(--clr-text-primary)",
                    color: "var(--clr-pure-white)",
                    width: "100%",
                  },
                  duration: 2000,
                });
              },
            }
          : {}),
      });
      return;
    }
    const errorMessage = getCoreServerErrorMessageFromFetcherError(
      otpTriggerError || error
    );
    if (errorMessage)
      toast.error(errorMessage, { id: "EpfTrackerVerifyPage__error" });
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

  function handleErrorModalClose() {
    setErrorModal(null);
  }
  function handleErrorCtaClick(url?: string) {
    if (!url) return handleErrorModalClose;
    return () => {
      router.push(url);
    };
  }

  function handleSuccessRedirectSideEffect() {
    setTimeout(() => {
      toast.success(t("epfo_passbook_updated"), {
        id: "EpfTrackerVerifyPage__success",
      });
    }, SHOW_SUCCESS_TOAST_AFTER_IN_MS);
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
    handleSuccessRedirectSideEffect();
    return <Redirect to="/epf-tracker" />;
  }

  const otpSentHintMessage =
    otpTriggerMutation.data?.message ??
    messageFromUrlQuery ??
    getOtpHintText(identifierFromUrlQuery, identifierValueFromUrlQuery);
  const _isLoading = isLoading || otpTriggerMutation.isLoading;
  const requestId = otpTriggerMutation.data?.requestId ?? requestIdFromUrlQuery;

  return (
    <>
      <EpfDetailsFetchVerify
        loading={_isLoading}
        requestId={requestId}
        message={otpSentHintMessage}
        onSubmit={handleSubmit}
        onResendClick={handleOtpResend}
        onEditClick={handleEditClick}
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
