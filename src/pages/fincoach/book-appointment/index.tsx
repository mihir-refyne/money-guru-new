import LoadingPage from "@/components/LoadingPage";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

export default function BookAppointment() {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  function handleIFrameLoad() {
    setIsIframeLoading(false);
  }

  return (
    <PageLayout hasLocalButton={false} navbarText="Schedule Appointment">
      {isIframeLoading && <LoadingPage />}
      <iframe
        src="https://calendly.com/atul-rai-refyne/financial-coaching-refyne?hide_event_type_details=1&hide_gdpr_banner=1"
        width="100%"
        height="700"
        style={{
          minWidth: "320px",
          border: "none",
        }}
        onLoad={handleIFrameLoad}
      />
    </PageLayout>
  );
}
