import { useEffect } from "react";
import { EpfFetchError } from "@/lib/epf";
import EpfTrackerLayout from "./EpfTrackerLayout";
import CenterContent from "../CenterContent";
import { APP_BASE_URL } from "@/constants";
import RiveWrapper from "../RiveWrapper";

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
  useEffect(() => {
    onMount?.();
  }, []);
  return (
    <EpfTrackerLayout
      alignContentCenter
      dispatchPopEventOnBackClick={directlyAccessed}
      footer={getFooterCta(error, onNavigate)}
    >
      <Content error={error} />
    </EpfTrackerLayout>
  );
}

function Content(props: { error: EpfFetchError }) {
  const textProps = getContentTexts(props.error);
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
  error: EpfFetchError
): { title: string; description: string } | null {
  if (error === EpfFetchError.USER_IS_IN_VERIFICATION_PENDING) {
    return {
      title: "Your KYC is in progress...",
      description: "It will take a some time to verify",
    };
  }
  if (error === EpfFetchError.USER_IS_NOT_KYC_VERIFIED) {
    return {
      title: "Complete your KYC",
      description: "To know about your PF contribution",
    };
  }
  return null;
}

function getFooterCta(
  error: EpfFetchError,
  onNavigate: (navigateTo: string, webviewRoute?: string) => void
) {
  function handleCompleteKycClick() {
    const appKycStartUrl = `${APP_BASE_URL}/#/?next=startActivation`;
    onNavigate(appKycStartUrl, "dashboard");
  }
  if (error === EpfFetchError.USER_IS_NOT_KYC_VERIFIED) {
    return (
      <button
        type="submit"
        className="btn btn-primary btn-block"
        onClick={handleCompleteKycClick}
      >
        Complete KYC
      </button>
    );
  }
}
