import React from "react";
import Rive, { Fit, Layout, Alignment } from "@rive-app/react-canvas";
import PageLayout from "../PageLayout";

// TODO: This can be a Independent component, refactor later
export default function EpfTrackerLoading() {
  return (
    <PageLayout
      navbarText="PF Passbook"
      hasLocaleChange={false}
      alignContentCenter
    >
      <Rive
        src="/assets/animations/epf_details_fetching.riv"
        layout={
          new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
          })
        }
        style={{
          height: "24rem",
        }}
      />
      <h2 className="text-heading text-semibold mt-4 mb-2">
        Fetching your EPF Records
      </h2>
      <p className="clr-text-secondary">This may take a few minutes</p>
    </PageLayout>
  );
}
