import { useEffect } from "react";
import { EpfFetchError } from "@/lib/epf";
import EpfTrackerLayout from "./EpfTrackerLayout";
import CenterContent from "../CenterContent";
import { APP_BASE_URL } from "@/constants";
import RiveWrapper from "../RiveWrapper";
import useTranslation from "@/hooks/useTranslation";

interface EpfPreCheckFailedViewProps {
  error: EpfFetchError;
  directlyAccessed: boolean;
  onMount?: () => void;
  onNavigate: (navigateTo: string, webviewRoute?: string) => void;
}

export default function EpfPreCheckFailedView({
  error,
  directlyAccessed,
  onMount,
  onNavigate,
}: EpfPreCheckFailedViewProps) {
  const { t } = useTranslation("common");
  useEffect(() => {
    onMount?.();
  }, []);
  return (
    <EpfTrackerLayout
      alignContentCenter
      dispatchPopEventOnBackClick={directlyAccessed}
      footer={getFooterCta({
        error,
        onNavigate,
        completeKycCtaLabel: t("complete_kyc_btn"),
      })}
    >
      <Content error={error} />
    </EpfTrackerLayout>
  );
}

function Content(props: { error: EpfFetchError }) {
  const { tWithoutTypeSafety } = useTranslation("common");
  const textProps = getContentTexts(props.error, tWithoutTypeSafety);
  if (textProps === null) return null;
  return (
    <CenterContent
      illustration={
        <RiveWrapper
          src="/assets/animations/pf_kyc_complete.riv"
          position="contain_center"
          style={{
            height: "24rem",
          }}
        />
      }
      {...textProps}
    />
  );
}

function getContentTexts(
  error: EpfFetchError,
  translate: (code: string) => string
): { title: string; description: string } | null {
  if (error === EpfFetchError.USER_IS_IN_VERIFICATION_PENDING) {
    return {
      title: translate("kyc_in_progress"),
      description: translate("it_will_take_some_time_verify"),
    };
  }
  if (error === EpfFetchError.USER_IS_NOT_KYC_VERIFIED) {
    return {
      title: translate("complete_your_kyc"),
      description: translate("to_know_pf_contribution"),
    };
  }
  return null;
}

function getFooterCta(context: {
  error: EpfFetchError;
  completeKycCtaLabel?: string;
  onNavigate: (navigateTo: string, webviewRoute?: string) => void;
}) {
  function handleCompleteKycClick() {
    const appKycStartUrl = `${APP_BASE_URL}/#/?next=startActivation`;
    context.onNavigate(appKycStartUrl, "dashboard");
  }
  if (context.error === EpfFetchError.USER_IS_NOT_KYC_VERIFIED) {
    return (
      <button
        type="submit"
        className="btn btn-primary btn-block"
        onClick={handleCompleteKycClick}
      >
        {context.completeKycCtaLabel}
      </button>
    );
  }
}
