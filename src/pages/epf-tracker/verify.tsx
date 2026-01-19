import EpfDetailsFetchVerify from "@/components/EpfTracker/EpfDetailsFetchVerify";
import EpfFailedView from "@/components/EpfTracker/EpfFailedView";
import EpfFetchErrorModalContentWrapper, {
  EpfFetchErrorModalContentProps,
} from "@/components/EpfTracker/EpfFetchErrorModalContent";
import EpfPendingView from "@/components/EpfTracker/EpfPendingView";
import EpfTrackerLoading from "@/components/EpfTracker/EpfTrackerLoading";
import { EpfTrackerServerErrorCodeToResponseModalMapPostOtp } from "@/components/EpfTracker/constants";
import { getEpfFetchIdentifierOrNull } from "@/components/EpfTracker/helpers";
import Modal from "@/components/Modal";
import useMutation from "@/hooks/useMutation";
import useTranslation from "@/hooks/useTranslation";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import {
  getCoreServerErrorCodeFromFetcherError,
  getCoreServerErrorMessageFromFetcherError,
} from "@/lib/core-server";
import {
  EPF_NO_RECORDS_FOUND_ERROR_CODES,
  EpfFetchDetailsStatusEnum,
  EpfFetchIdentifier,
  EpfFetchSessionStatusResponse,
  clearEpfDetailsFromSessionStorage,
  fetchEpfSessionStatus,
  triggerOtpForEpfDetailsFetch,
  verifyOtpForEpfDetailsFetch,
} from "@/lib/epf";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SHOW_SUCCESS_TOAST_AFTER_IN_MS = 500;
const VERIFY_OTP_TIMEOUT_MS = 2000;

function getOtpHintText(identifier: string, value: string): string | undefined {
  if (identifier === "uan")
    return `OTP sent to Mobile No linked with UAN: ${value}`;
  if (identifier === "mobileNo") return `OTP sent to Mobile No: ${value}`;
}

// Helper function to race a promise against a timeout
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<{ success: boolean; data?: T; timedOut: boolean }> {
  return Promise.race([
    promise.then((data) => ({ success: true, data, timedOut: false })),
    new Promise<{ success: boolean; timedOut: boolean }>((resolve) =>
      setTimeout(() => resolve({ success: false, timedOut: true }), timeoutMs),
    ),
  ]);
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
  const [sessionStatusData, setSessionStatusData] =
    useState<EpfFetchSessionStatusResponse | null>(null);
  const [isCheckingSessionStatus, setIsCheckingSessionStatus] = useState(false);
  const [hasCheckedSessionStatus, setHasCheckedSessionStatus] = useState(false);
  const [otpVerificationComplete, setOtpVerificationComplete] = useState(false);

  const { isLoading, data, error, mutate } = useMutation(
    verifyOtpForEpfDetailsFetch,
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
          errorModalContent.primaryCta?.url,
        );
      }
      setErrorModal({
        ...errorModalContent,
        ...(errorCodeForEvent === "E74005"
          ? {
              onClick: () => {
                logAnalyticsEvent(
                  ["mixpanel", "webengage"],
                  AnalyticEvent.EPFO_UNAVAILABLE_MODAL_NOTIFY_CTA_CLICKED,
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
      otpTriggerError || error,
    );
    if (errorMessage)
      toast.error(errorMessage, { id: "EpfTrackerVerifyPage__error" });
  }, [error, otpTriggerMutation.error]);

  async function handleSubmit(payload: { requestId: string; otp: string }) {
    logEventInMixpanel(AnalyticEvent.EPF_OTP_SCREEN_NEXT_CLICKED, {
      auth_method: identifierFromUrlQuery,
    });

    // Call the mutation with timeout
    const otpPromise = verifyOtpForEpfDetailsFetch(payload);
    const result = await withTimeout(otpPromise, VERIFY_OTP_TIMEOUT_MS);

    if (result.timedOut) {
      // Timeout occurred - proceed to check session status anyway
      setHasCheckedSessionStatus(true);
      setOtpVerificationComplete(true);
      clearEpfDetailsFromSessionStorage();
      setIsCheckingSessionStatus(true);
      try {
        const statusResp = await fetchEpfSessionStatus();
        setSessionStatusData(statusResp);
      } catch (error: any) {
        // On error, show toast and redirect to start page
        const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
        if (errorMessage) {
          toast.error(errorMessage, {
            id: "EpfTrackerVerifyPage__session_status_error",
          });
        }
        router.replace("/epf-tracker/start");
      } finally {
        setIsCheckingSessionStatus(false);
      }
    } else if (result.success) {
      // OTP verification succeeded within timeout - use the mutate to update state
      return mutate(payload);
    }
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

  // Fetch session status after successful OTP verification
  useEffect(() => {
    if (!data || hasCheckedSessionStatus) return;

    async function checkSessionStatus() {
      setHasCheckedSessionStatus(true);
      setIsCheckingSessionStatus(true);
      try {
        const statusResp = await fetchEpfSessionStatus();
        setSessionStatusData(statusResp);
      } catch (error: any) {
        // On error, show toast and redirect to start page
        const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
        if (errorMessage) {
          toast.error(errorMessage, {
            id: "EpfTrackerVerifyPage__session_status_error",
          });
        }
        router.replace("/epf-tracker/start");
      } finally {
        setIsCheckingSessionStatus(false);
      }
    }

    clearEpfDetailsFromSessionStorage();
    checkSessionStatus();
  }, [data, hasCheckedSessionStatus]);

  function handleRetryClick() {
    router.replace("/epf-tracker/start");
  }

  function handlePendingViewMount() {
    logEventInMixpanel(AnalyticEvent.EPF_AUTH_SCREEN, {
      screen_type: "PENDING",
    });
  }

  function handleFailedViewMount() {
    logEventInMixpanel(AnalyticEvent.EPF_AUTH_SCREEN, {
      screen_type: "FAILED",
    });
  }

  // Redirect to /epf-tracker if arriving without proper navigation context
  // This handles page refresh scenarios
  useEffect(() => {
    // Only redirect if query params are missing
    if (!requestIdFromUrlQuery || !identifierFromUrlQuery || !identifierValueFromUrlQuery) {
      router.replace("/epf-tracker");
      return;
    }
    
    // Check if we're in an active OTP flow (set by start page before navigation)
    const isActiveOtpFlow = sessionStorage.getItem("epf_otp_flow_active");
    
    if (!isActiveOtpFlow) {
      // No active OTP flow marker = this is a page refresh/direct access
      router.replace("/epf-tracker");
    } else {
      // Clear the marker after checking (one-time use)
      sessionStorage.removeItem("epf_otp_flow_active");
    }
  }, [requestIdFromUrlQuery, identifierFromUrlQuery, identifierValueFromUrlQuery, router]);

  // Redirect based on session status
  useEffect(() => {
    if (!sessionStatusData || isCheckingSessionStatus) return;

    const { status } = sessionStatusData;

    if (status === EpfFetchDetailsStatusEnum.SUCCESS) {
      setTimeout(() => {
        toast.success(t("epfo_passbook_updated"), {
          id: "EpfTrackerVerifyPage__success",
        });
      }, SHOW_SUCCESS_TOAST_AFTER_IN_MS);
      router.replace("/epf-tracker");
    } else if (status === EpfFetchDetailsStatusEnum.NOT_STARTED) {
      router.replace("/epf-tracker/start");
    }
  }, [sessionStatusData, isCheckingSessionStatus, router, t]);

  if (
    !requestIdFromUrlQuery ||
    !identifierFromUrlQuery ||
    !identifierValueFromUrlQuery
  ) {
    return <EpfTrackerLoading />;
  }

  if (data || otpVerificationComplete) {
    // Show loader while checking session status
    if (isCheckingSessionStatus) {
      return <EpfTrackerLoading />;
    }

    // Handle different session statuses
    if (sessionStatusData) {
      const { status } = sessionStatusData;
      const directlyAccessed = false;

      // SUCCESS or NOT_STARTED: Show loader while redirecting (useEffect handles redirect)
      if (
        status === EpfFetchDetailsStatusEnum.SUCCESS ||
        status === EpfFetchDetailsStatusEnum.NOT_STARTED
      ) {
        return <EpfTrackerLoading />;
      }

      // PENDING: Show pending view
      if (status === EpfFetchDetailsStatusEnum.PENDING) {
        return (
          <EpfPendingView
            directlyAccessed={directlyAccessed}
            onMount={handlePendingViewMount}
          />
        );
      }

      // FAILED: Show failed view with retry option
      if (status === EpfFetchDetailsStatusEnum.FAILED) {
        return (
          <EpfFailedView
            directlyAccessed={directlyAccessed}
            onMount={handleFailedViewMount}
            onRetryClick={handleRetryClick}
          />
        );
      }
    }

    // Fallback: still checking session status
    return <EpfTrackerLoading />;
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
