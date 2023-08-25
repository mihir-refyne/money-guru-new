import { ArrowClockwise } from "phosphor-react";
import NoRecordFound from "../NoRecordFound";
import EpfTrackerLayout from "./EpfTrackerLayout";
import useTranslation from "@/hooks/useTranslation";

interface EpfRecordNotFoundProps {
  directlyAccessed: boolean;
  onRetryClick?: () => void;
}

export default function EpfRecordNotFound({
  directlyAccessed,
  onRetryClick,
}: EpfRecordNotFoundProps) {
  const { t } = useTranslation("common");
  return (
    <EpfTrackerLayout
      alignContentCenter
      footer={
        <button
          className="btn btn-primary btn-block flex-center"
          onClick={onRetryClick}
        >
          <span>{t("retry_btn")}</span>
          <ArrowClockwise size={16} className="ml-2" />
        </button>
      }
      dispatchPopEventOnBackClick={directlyAccessed}
    >
      <NoRecordFound
        transparent
        title={t("fetch_pf_details_error")}
        description={t("click_retry_instruction")}
      />
    </EpfTrackerLayout>
  );
}
