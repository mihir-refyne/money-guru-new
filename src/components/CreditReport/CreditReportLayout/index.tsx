import React, { ReactNode } from "react";
import PageLayout from "../../PageLayout";
import CommonFooter from "./CommonFooter";
import { useShare } from "@/hooks/useShare";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import useTranslation from "@/hooks/useTranslation";
import { isIOS } from "@/lib/utils";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";

const DEFAULT_CREDIT_REPORT_SHARE_PAYLOAD = {
  text: "🚀 Unlock your financial potential with our comprehensive Credit Score!  🌟 \n\n- Check your credit score for free 🆓 and understand the key factors that impact it.\n- Receive monthly updates 📅 and expert tips 📈 to improve your score and secure your financial future.\n\nStart optimising your credit today -",
  url: "https://refyne.page.link/mg-share",
  imageUrls: [],
};

interface CreditReportLayoutProps {
  navbarText?: string;
  transparentNavbar?: boolean;
  alignContentCenter?: boolean;
  hasContentPadding?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  hasShare?: boolean;
  dispatchPopEventOnBackClick?: boolean;
}

export default function CreditReportLayout({
  navbarText,
  transparentNavbar,
  alignContentCenter,
  hasContentPadding,
  children,
  footer,
  hasShare = true,
  dispatchPopEventOnBackClick,
}: CreditReportLayoutProps) {
  const { t } = useTranslation("common");
  const defaultNavbarText = t("credit_score");

  const appPlatformName = getValueFromMetadata("appPlatformName");
  const { shareInProgress, shareOrClipboardCopy } = useShare({
    isNativePlatformShareSupported:
      isCurrentlyOnRefyneWebview(appPlatformName) && !isIOS(),
  });

  function handleShareClick() {
    if (shareInProgress) return;
    logAnalyticsEvent(["mixpanel"], AnalyticEvent.MONEY_GURU_SHARE_CLICKED, {
      tool_name: "CREDIT_REPORT",
    });
    shareOrClipboardCopy(DEFAULT_CREDIT_REPORT_SHARE_PAYLOAD, {
      showToastOnClipboardCopy: true,
    });
  }
  return (
    <PageLayout
      navbarText={navbarText ?? defaultNavbarText}
      transparentNavbar={transparentNavbar}
      hasContentPadding={hasContentPadding}
      alignContentCenter={alignContentCenter}
      hasLocaleChange={false}
      dispatchPopEventOnBackClick={dispatchPopEventOnBackClick}
      hasShare={hasShare}
      onShareClick={handleShareClick}
      footer={
        <>
          {footer}
          <CommonFooter />
        </>
      }
    >
      {children}
    </PageLayout>
  );
}
