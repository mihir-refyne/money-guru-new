import { ReactElement, ReactNode } from "react";
import PageLayout from "../PageLayout";
import EpfTrackerCommonFooter from "./EpfTrackerCommonFooter";
import { useShare } from "@/hooks/useShare";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import useTranslation from "@/hooks/useTranslation";

const DEFAULT_EPF_TRACKER_SHARE_PAYLOAD = {
  text: "Track your savings effortlessly! Stay updated with our EPF Tracker!",
  url: "https://refyne.page.link/install",
  imageUrls: [],
};

interface EpfTrackerLayoutProps {
  navbarText?: string;
  alignContentCenter?: boolean;
  children: ReactNode;
  footer?: ReactElement;
  dispatchPopEventOnBackClick?: boolean;
  hasContentPadding?: boolean;
  hasShare?: boolean;
}

export default function EpfTrackerLayout({
  navbarText,
  alignContentCenter,
  children,
  footer,
  dispatchPopEventOnBackClick,
  hasContentPadding,
  hasShare = false,
}: EpfTrackerLayoutProps) {
  const { t } = useTranslation("common");
  const defaultNavbarText = t("pf_passbook_label");
  
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const { shareInProgress, shareOrClipboardCopy } = useShare({
    isNativePlatformShareSupported: isCurrentlyOnRefyneWebview(appPlatformName),
  });

  function handleShareClick() {
    if (shareInProgress) return;
    shareOrClipboardCopy(DEFAULT_EPF_TRACKER_SHARE_PAYLOAD, {
      showToastOnClipboardCopy: true,
    });
  }

  return (
    <PageLayout
      navbarText={navbarText ?? defaultNavbarText}
      alignContentCenter={alignContentCenter}
      hasLocaleChange={false}
      dispatchPopEventOnBackClick={dispatchPopEventOnBackClick}
      hasContentPadding={hasContentPadding}
      footer={<div className="p-4">{footer ?? <EpfTrackerCommonFooter />}</div>}
      hasShare={hasShare}
      onShareClick={handleShareClick}
    >
      {children}
    </PageLayout>
  );
}
