import React, { ReactNode } from "react";
import PageLayout from "../../PageLayout";
import CommonFooter from "./CommonFooter";
import { useShare } from "@/hooks/useShare";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import useTranslation from "@/hooks/useTranslation";

const DEFAULT_CREDIT_REPORT_SHARE_PAYLOAD = {
  text: "Aiming for a loan or credit? Check your Credit Score now!",
  url: "https://refyne.page.link/install",
  imageUrls: [],
};

interface CreditReportLayoutProps {
  navbarText?: string;
  alignContentCenter?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  hasShare?: boolean;
  dispatchPopEventOnBackClick?: boolean;
}

export default function CreditReportLayout({
  navbarText,
  alignContentCenter,
  children,
  footer,
  hasShare = true,
  dispatchPopEventOnBackClick,
}: CreditReportLayoutProps) {
  const { t } = useTranslation("common");
  const defaultNavbarText = t("credit_score");
  
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const { shareInProgress, shareOrClipboardCopy } = useShare({
    isNativePlatformShareSupported: isCurrentlyOnRefyneWebview(appPlatformName),
  });

  function handleShareClick() {
    if (shareInProgress) return;
    shareOrClipboardCopy(DEFAULT_CREDIT_REPORT_SHARE_PAYLOAD, {
      showToastOnClipboardCopy: true,
    });
  }
  return (
    <PageLayout
      navbarText={navbarText ?? defaultNavbarText}
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
