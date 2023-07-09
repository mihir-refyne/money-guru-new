import { useRouter } from "next/router";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import Link from "next/link";

// TODO: Update the path as PM gave
const EPF_RSHORT_PATH = "/shorts";

const ROUTE_PATH_TO_SCREEN_NAME_MAP: Record<string, string> = {
  "/epf-tracker": "EPF_DASHBOARD",
  "/epf-tracker/passbook": "EPF_EMPLOYER_DETAILS",
};

export default function EpfTrackerCommonFooter() {
  const router = useRouter();

  function handleLinkClickSideEffect() {
    const screenName = ROUTE_PATH_TO_SCREEN_NAME_MAP[router.pathname];
    if (!screenName) return;
    logEventInMixpanel(AnalyticEvent.EPF_FOOTER_CTA_CLICKED, {
      screen_name: screenName,
    });
  }

  return (
    <>
      <p className="text-body text-medium mb-4">
        It is not advised to withdraw your PF amount
      </p>
      <Link
        href={EPF_RSHORT_PATH}
        className="unstyled-link btn btn-primary flex-center"
        onClick={handleLinkClickSideEffect}
      >
        Learn More about PF
      </Link>
    </>
  );
}
