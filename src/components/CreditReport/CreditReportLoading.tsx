import React from "react";
import CreditReportLayout from "./CreditReportLayout";
import styles from "./CreditReportLoading.module.css";
import RiveWrapper from "../RiveWrapper";
import useTranslation from "@/hooks/useTranslation";

export default function CreditReportLoading() {
  const { t } = useTranslation("common");
  return (
    <CreditReportLayout alignContentCenter>
      <RiveWrapper
        src="/assets/animations/credit_score.riv"
        className={styles.CreditReportLoading}
        position="contain_center"
      />
      <h2 className="text-heading text-semibold mt-4 mb-2">
        {t("fetching_credit_score")}
      </h2>
      <p className="clr-text-secondary">{t("fetching_delay")}</p>
    </CreditReportLayout>
  );
}
