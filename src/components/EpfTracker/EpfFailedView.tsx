import { useEffect } from "react";
import { X } from "phosphor-react";
import EpfTrackerLayout from "./EpfTrackerLayout";
import useTranslation from "@/hooks/useTranslation";

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
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={onRetryClick}
        >
          {t("retry_btn")}
        </button>
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
            marginBottom: "var(--spacing-6)",
          }}
        >
          <X size={48} weight="bold" color="var(--clr-error-default)" />
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
