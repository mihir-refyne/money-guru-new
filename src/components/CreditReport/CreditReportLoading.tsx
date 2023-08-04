import React from "react";
import CreditReportLayout from "./CreditReportLayout";
import styles from "./CreditReportLoading.module.css";
import RiveWrapper from "../RiveWrapper";

export default function CreditReportLoading() {
  return (
    <CreditReportLayout alignContentCenter>
      <RiveWrapper
        src="/assets/animations/credit_score.riv"
        className={styles.CreditReportLoading}
        position="contain_center"
      />
      <h2 className="text-heading text-semibold mt-4 mb-2">
        Fetching your Credit Score
      </h2>
      <p className="clr-text-secondary">This may take a few minutes</p>
    </CreditReportLayout>
  );
}
