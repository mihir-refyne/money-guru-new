import React from "react";
import CircularSpinner from "../CircularSpinner";
import PageLayout from "../PageLayout";

export default function LoadingPage() {
  return (
    <PageLayout hasNavbar={false} alignContentCenter>
      <CircularSpinner />
    </PageLayout>
  );
}
