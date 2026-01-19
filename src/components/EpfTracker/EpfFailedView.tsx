import useTranslation from "@/hooks/useTranslation";
import errorWarningLine from "@/images/error-warning-line.svg";
import Image from "next/image";
import { useEffect } from "react";
import EpfTrackerLayout from "./EpfTrackerLayout";

interface EpfFailedViewProps {
  errorMessage?: string;
  directlyAccessed: boolean;
  onMount?: () => void;
  onRetryClick: () => void;
}

export default function EpfFailedView({
  errorMessage,
  directlyAccessed,
  onMount,
  onRetryClick,
}: EpfFailedViewProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");

  useEffect(() => {
    onMount?.();
  }, [onMount]);

  return (
    <EpfTrackerLayout
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
              window.history.back();
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
          {tWithoutTypeSafety("epf_failed_title")}
        </h2>
        <p className="text-body text-regular clr-text-secondary text-center">
          {errorMessage || tWithoutTypeSafety("epf_failed_description")}
        </p>
      </div>
    </EpfTrackerLayout>
  );
}
