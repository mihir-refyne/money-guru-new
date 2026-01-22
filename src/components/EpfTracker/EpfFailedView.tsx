import { APP_BASE_URL } from "@/constants";
import useTranslation, { TranslationsKeys } from "@/hooks/useTranslation";
import errorWarningLine from "@/images/error-warning-line.svg";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import {
  EpfFetchDetailsStatusEnum,
  EpfFetchSessionStatusResponse,
} from "@/lib/epf";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import Image from "next/image";
import router from "next/router";
import { useEffect } from "react";
import EpfTrackerLayout from "./EpfTrackerLayout";

type EpfFetchSessionStatusFailedErrorCode = Extract<
  EpfFetchSessionStatusResponse,
  { status: EpfFetchDetailsStatusEnum.FAILED }
>["errorCode"];

interface EpfFailedViewProps {
  directlyAccessed: boolean;
  onMount?: () => void;
  onRetryClick: () => void;
  errorCode: EpfFetchSessionStatusFailedErrorCode;
}

const errorCodeToMessageTitleMap: Record<
  EpfFetchSessionStatusFailedErrorCode,
  TranslationsKeys[keyof TranslationsKeys]
> = {
  E74001: "epf_failure_no_records_found_title",
  E74002: "epf_failure_max_retries_exceeded_title",
  E74003: "epf_failure_multiple_records_exist_title",
  E74004: "epf_failure_request_expired_title",
  E74005: "epf_failure_service_unavailable_title",
  E74006: "epf_failure_invalid_input_title",
  E74007: "epf_failure_request_timeout_title",
};

const errorCodeToMessageDescriptionMap: Record<
  EpfFetchSessionStatusFailedErrorCode,
  TranslationsKeys[keyof TranslationsKeys]
> = {
  E74001: "epf_failure_no_records_found_description",
  E74002: "epf_failure_max_retries_exceeded_description",
  E74003: "epf_failure_multiple_records_exist_description",
  E74004: "epf_failure_request_expired_description",
  E74005: "epf_failure_service_unavailable_description",
  E74006: "epf_failure_invalid_input_description",
  E74007: "epf_failure_request_timeout_description",
};

export default function EpfFailedView({
  directlyAccessed,
  onMount,
  onRetryClick,
  errorCode,
}: EpfFailedViewProps) {
  const { t } = useTranslation("common");

  const errorTitleTranslationKey =
    errorCodeToMessageTitleMap[errorCode] ?? "epf_failure_generic_error_title";
  const errorDescriptionTranslationKey =
    errorCodeToMessageDescriptionMap[errorCode] ??
    "epf_failure_generic_error_description";

  useEffect(() => {
    onMount?.();
  }, [onMount]);

  return (
    <EpfTrackerLayout
      hasHelpButton
      navbarText=""
      alignContentCenter
      dispatchPopEventOnBackClick={directlyAccessed}
      footer={
        <div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onRetryClick}
          >
            {t("retry_btn")}
          </button>
          <button
            type="button"
            className="btn btn-text btn-block mt-2"
            onClick={() => {
              const isWebviewInsideRefyneApp = isCurrentlyOnRefyneWebview(
                getValueFromMetadata("appPlatformName"),
              );
              if (isWebviewInsideRefyneApp) {
                return dispatchDataToNativePlatform({
                  type: "ROUTE_TO_SCREEN",
                  body: {
                    screenName: "dashboard",
                  },
                });
              }
              router.push(APP_BASE_URL);
            }}
          >
            {t("epf_failure_go_to_dashboard")}
          </button>
        </div>
      }
    >
      <div
        className="flex-center"
        style={{
          flexDirection: "column",
          padding: "var(--spacing-6)",
        }}
      >
        <div
          className="flex-center"
          style={{
            width: "8rem",
            height: "8rem",
            borderRadius: "50%",
            backgroundColor: "var(--clr-error-light)",
            marginBottom: "16px",
          }}
        >
          <Image height={56} width={56} src={errorWarningLine} alt="error" />
        </div>
        <h2 className="text-heading text-semibold text-center mb-4">
          {t(errorTitleTranslationKey)}
        </h2>
        <p className="text-body text-regular clr-text-secondary text-center">
          {t(errorDescriptionTranslationKey)}
        </p>
      </div>
    </EpfTrackerLayout>
  );
}
