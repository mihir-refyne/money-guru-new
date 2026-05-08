import CreditReportIntroduction from "@/components/CreditReport/CreditReportIntroduction";
import LoadingPage from "@/components/LoadingPage";
import useFetcher from "@/hooks/useFetcher";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { getCreditBureauConsent } from "@/lib/credit-report";
import {
  isCreditReportIntroViewed,
  setCreditReportIntroViewed,
} from "@/lib/credit-report/introduction";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CreditReportIntroductionPage() {
  const router = useRouter();
  const {
    isLoading,
    data: isConsentProvided,
    error,
  } = useFetcher(getCreditBureauConsent);

  // TODO: Add unleash also, maybe
  const isAlreadyViewed = isCreditReportIntroViewed();

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // page restored from bfcache
        window.location.reload();
        // or trigger fetch/reset logic instead
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    if (isAlreadyViewed && isConsentProvided) {
      router.replace({
        pathname: "/credit-report/summary",
        query: router.query,
      });
      return;
    }
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_ONBOARDING_SCREEN);
  }, [isConsentProvided, isAlreadyViewed]);

  function handleUserFeedbackUpdateAndNavigate(answer?: string) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_ONBOARDING_CTA_CLICKED, {
      cta_type: answer ?? "LETS_CHECK",
    });
    if (error) return;
    if (!isConsentProvided) {
      setCreditReportIntroViewed();
      router.replace(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}#/consent/credit-report?returnBack=true`,
      );
      return;
    }
    router.replace("/credit-report/summary");
    setCreditReportIntroViewed();
  }

  const directlyAccessed = !!router.query["direct"];

  if (isAlreadyViewed && isConsentProvided) {
    return null;
  }
  if (isLoading) return <LoadingPage />;
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
