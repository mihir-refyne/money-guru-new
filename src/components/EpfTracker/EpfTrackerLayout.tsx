import { ReactElement, ReactNode } from "react";
import PageLayout from "../PageLayout";
import EpfTrackerCommonFooter from "./EpfTrackerCommonFooter";
import { useShare } from "@/hooks/useShare";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import useTranslation from "@/hooks/useTranslation";
import { isIOS } from "@/lib/utils";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";

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
    isNativePlatformShareSupported:
      isCurrentlyOnRefyneWebview(appPlatformName) && !isIOS(),
  });

  function handleShareClick() {
    if (shareInProgress) return;
    logAnalyticsEvent(["mixpanel"], AnalyticEvent.MONEY_GURU_SHARE_CLICKED, {
      tool_name: "EPF_TRACKER",
    });
    shareOrClipboardCopy(DEFAULT_EPF_TRACKER_SHARE_PAYLOAD, {
      showToastOnClipboardCopy: true,
    });
  }

  return (
    <PageLayout
      pageBackground="#F7F7F7"
      navbarText={navbarText ?? defaultNavbarText}
      alignContentCenter={alignContentCenter}
      hasLocaleChange={false}
      dispatchPopEventOnBackClick={dispatchPopEventOnBackClick}
      hasContentPadding={hasContentPadding}
      footer={footer ? <div className="p-4">{footer}</div> : undefined}
      hasShare={hasShare}
      onShareClick={handleShareClick}
    >
      {children}
    </PageLayout>
  );
}
