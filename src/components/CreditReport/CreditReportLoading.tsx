import React from "react";
import Rive, { Fit, Layout, Alignment } from "@rive-app/react-canvas";
import CreditReportLayout from "./CreditReportLayout";
import styles from "./CreditReportLoading.module.css";

export default function CreditReportLoading() {
  return (
    <CreditReportLayout alignContentCenter>
      <Rive
        src="/assets/animations/credit_score.riv"
        className={styles.CreditReportLoading}
        layout={
          new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
          })
        }
      />
      <h2 className="text-heading text-semibold mt-4 mb-2">
        Fetching your Credit Score
      </h2>
      <p className="clr-text-secondary">This may take a few minutes</p>
    </CreditReportLayout>
  );
}
