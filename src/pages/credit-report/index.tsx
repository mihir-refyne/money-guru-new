import CreditReportIntroduction from "@/components/CreditReport/CreditReportIntroduction";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import {
  isCreditReportIntroViewed,
  setCreditReportIntroViewed,
} from "@/lib/credit-report/introduction";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CreditReportIntroductionPage() {
  const router = useRouter();

  // TODO: Add unleash also, maybe
  const isAlreadyViewed = isCreditReportIntroViewed();

  useEffect(() => {
    if (isAlreadyViewed) {
      router.replace({
        pathname: "/credit-report/summary",
        query: router.query,
      });
      return;
    }
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_ONBOARDING_SCREEN);
  }, []);

  function handleUserFeedbackUpdateAndNavigate(answer?: string) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_ONBOARDING_CTA_CLICKED, {
      cta_type: answer ?? "LETS_CHECK",
    });
    router.replace("/credit-report/summary");
    setCreditReportIntroViewed();
  }

  const directlyAccessed = !!router.query["direct"];

  if (isAlreadyViewed) {
    return null;
  }

  return (
    <CreditReportIntroduction
      onUserFeedbackChange={handleUserFeedbackUpdateAndNavigate}
      onNext={handleUserFeedbackUpdateAndNavigate}
      directAccess={directlyAccessed}
    />
  );
}

export function getStaticProps() {
  return {
    props: {},
  };
}
