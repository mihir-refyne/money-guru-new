import React from "react";
import PageLayout from "../PageLayout";
import RiveWrapper from "../RiveWrapper";

// TODO: This can be a Independent component, refactor later
export default function EpfTrackerLoading() {
  return (
    <PageLayout
      navbarText="PF Passbook"
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
        Fetching your EPF Records
      </h2>
      <p className="clr-text-secondary">This may take a few minutes</p>
    </PageLayout>
  );
}
