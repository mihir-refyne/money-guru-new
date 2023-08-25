import React from "react";
import PageLayout from "../PageLayout";
import RiveWrapper from "../RiveWrapper";
import useTranslation from "@/hooks/useTranslation";

// TODO: This can be a Independent component, refactor later
export default function EpfTrackerLoading() {
  const { t } = useTranslation("common");
  return (
    <PageLayout
      navbarText={t("pf_passbook_label")}
      hasLocaleChange={false}
      alignContentCenter
    >
      <RiveWrapper
        src="/assets/animations/epf_details_fetching.riv"
        position="contain_center"
        style={{
          height: "24rem",
        }}
      />
      <h2 className="text-heading text-semibold mt-4 mb-2">
        {t("fetching_epf_records")}
      </h2>
      <p className="clr-text-secondary">{t("fetching_delay_notice")}</p>
    </PageLayout>
  );
}
