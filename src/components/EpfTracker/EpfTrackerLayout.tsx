import { ReactElement, ReactNode } from "react";
import PageLayout from "../PageLayout";
import EpfTrackerCommonFooter from "./EpfTrackerCommonFooter";
import useTranslation from "@/hooks/useTranslation";

interface EpfTrackerLayoutProps {
  navbarText?: string;
  alignContentCenter?: boolean;
  children: ReactNode;
  footer?: ReactElement;
  dispatchPopEventOnBackClick?: boolean;
  hasContentPadding?: boolean;
}

export default function EpfTrackerLayout({
  navbarText,
  alignContentCenter,
  children,
  footer,
  dispatchPopEventOnBackClick,
  hasContentPadding,
}: EpfTrackerLayoutProps) {
  const { t } = useTranslation("common");
  const defaultNavbarText = t("pf_passbook_label");
  return (
    <PageLayout
      navbarText={navbarText ?? defaultNavbarText}
      alignContentCenter={alignContentCenter}
      hasLocaleChange={false}
      dispatchPopEventOnBackClick={dispatchPopEventOnBackClick}
      hasContentPadding={hasContentPadding}
      footer={<div className="p-4">{footer ?? <EpfTrackerCommonFooter />}</div>}
    >
      {children}
    </PageLayout>
  );
}
