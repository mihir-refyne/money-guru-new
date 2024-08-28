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
  text: "🌟 Discover your financial future with Refyne's PF Tracker!  \n\n- Know how much you've invested in your PF account 📊\n- Get detailed insights on your monthly contributions, interest earned 📈, and see future projections 🚀 of how much you'll accumulate by retirement.\n\n Stay on top of your savings effortlessly - ",
  url: "https://refyne.page.link/mg-share",
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
      pageBackground="#FFFFFF"
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
