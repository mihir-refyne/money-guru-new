import React, { ReactNode } from "react";
import PageLayout from "../../PageLayout";
import CommonFooter from "./CommonFooter";

interface CreditReportLayoutProps {
  navbarText?: string;
  alignContentCenter?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  dispatchPopEventOnBackClick?: boolean;
}

export default function CreditReportLayout({
  navbarText = "Credit Score",
  alignContentCenter,
  children,
  footer,
  dispatchPopEventOnBackClick,
}: CreditReportLayoutProps) {
  return (
    <PageLayout
      navbarText={navbarText}
      alignContentCenter={alignContentCenter}
      hasLocaleChange={false}
      dispatchPopEventOnBackClick={dispatchPopEventOnBackClick}
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
