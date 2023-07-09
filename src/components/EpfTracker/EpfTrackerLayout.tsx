import { ReactElement, ReactNode } from "react";
import PageLayout from "../PageLayout";
import EpfTrackerCommonFooter from "./EpfTrackerCommonFooter";

interface EpfTrackerLayoutProps {
  navbarText?: string;
  alignContentCenter?: boolean;
  children: ReactNode;
  footer?: ReactElement;
  dispatchPopEventOnBackClick?: boolean;
  hasContentPadding?: boolean;
}

export default function EpfTrackerLayout({
  navbarText = "PF Passbook",
  alignContentCenter,
  children,
  footer,
  dispatchPopEventOnBackClick,
  hasContentPadding,
}: EpfTrackerLayoutProps) {
  return (
    <PageLayout
      navbarText={navbarText}
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
