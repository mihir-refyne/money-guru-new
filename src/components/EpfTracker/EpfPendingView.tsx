import { APP_BASE_URL } from "@/constants";
import useTranslation from "@/hooks/useTranslation";
import errorWarningLine from "@/images/error-warning-line.svg";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import Image from "next/image";
import router from "next/router";
import { useEffect } from "react";
import EpfTrackerLayout from "./EpfTrackerLayout";

interface EpfPendingViewProps {
  directlyAccessed: boolean;
  onMount?: () => void;
}

export default function EpfPendingView({
  directlyAccessed,
  onMount,
}: EpfPendingViewProps) {
  const { tWithoutTypeSafety, t } = useTranslation("common");

  useEffect(() => {
    onMount?.();
  }, [onMount]);

  return (
    <EpfTrackerLayout
      navbarText=""
      hasHelpButton
      alignContentCenter
      dispatchPopEventOnBackClick={directlyAccessed}
      footer={
        <div>
          <button
            type="button"
            className="btn btn-primary btn-block"
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
            {t("epf_failure_go_back_to_dashboard")}
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
          {tWithoutTypeSafety("epf_pending_title")}
        </h2>
        <p className="text-body text-regular clr-text-secondary text-center">
          {tWithoutTypeSafety("epf_pending_description")}
        </p>
      </div>
    </EpfTrackerLayout>
  );
}
