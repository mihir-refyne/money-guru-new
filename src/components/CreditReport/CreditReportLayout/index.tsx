import React, { ReactNode } from "react";
import PageLayout from "../../PageLayout";
import CommonFooter from "./CommonFooter";
import useTranslation from "@/hooks/useTranslation";

interface CreditReportLayoutProps {
  navbarText?: string;
  alignContentCenter?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  dispatchPopEventOnBackClick?: boolean;
}

export default function CreditReportLayout({
  navbarText,
  alignContentCenter,
  children,
  footer,
  dispatchPopEventOnBackClick,
}: CreditReportLayoutProps) {
  const { t } = useTranslation("common");
  const defaultNavbarText = t("credit_score");
  return (
    <PageLayout
      navbarText={navbarText ?? defaultNavbarText}
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
