import useTranslation from "@/hooks/useTranslation";

interface EpfTrackerFetchFooterProps {
  formId?: string;
  buttonDisabled?: boolean;
  onClick?: () => void;
}

export default function EpfTrackerFetchFooter({
  formId,
  buttonDisabled,
  onClick,
}: EpfTrackerFetchFooterProps) {
  const { t } = useTranslation("common");
  return (
    <>
      <button
        type="submit"
        className="btn btn-primary btn-block"
        form={formId}
        onClick={onClick}
        disabled={buttonDisabled}
      >
        {t("next_btn")}
      </button>
      <p className="text-caption clr-text-secondary mt-4">
        {t("consent_fetch_pf_details")}
      </p>
    </>
  );
}
