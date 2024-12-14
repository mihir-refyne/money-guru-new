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
        src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3vAgfClUjR6NJIpBjJRd1VAw9QZzT2SoBxDhR_tlNJ-ZHEofZsvgnry88D66GKaRfGDHvsoUEE?gv=true"
        style={{ border: "0" }}
        width="100%"
        height="600"
        onLoad={handleIFrameLoad}
      />
    </PageLayout>
  );
}
