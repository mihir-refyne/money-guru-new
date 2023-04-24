import CreditReportLoading from "@/components/CreditReport/CreditReportLoading";
import CreditReportSummary from "@/components/CreditReport/CreditReportSummary";
import useFetcher from "@/hooks/useFetcher";
import useSyntheticLoader from "@/hooks/useSyntheticLoader";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import {
  getOrFetchCreditReport,
  isCreditReportThereInSessionStorage,
} from "@/lib/credit-report";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CreditReportSummaryPage() {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(getOrFetchCreditReport);
  const { isLoading: syntheticLoader, setIsLoading } = useSyntheticLoader(
    false,
    3 * 1000
  );

  useEffect(() => {
    if (isCreditReportThereInSessionStorage()) return;
    setIsLoading(true);
  }, []);

  function handleOnMount(context?: { rating?: string }) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_DASHBOARD_SCREEN, {
      rating: context?.rating,
    });
  }

  function handleRatingTagClick(rating?: string) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_RATING_TAG_CLICKED, {
      rating,
      screen_name: router.pathname.split("/").pop(),
    });
  }

  function handleCtaClickSideEffect(routePath: string) {
    const isCreditReportFactorClicked = routePath.startsWith("/credit-report");
    if (isCreditReportFactorClicked) {
      const factorType = routePath.split("/").pop();
      if (!factorType) return;
      return logEventInMixpanel(
        AnalyticEvent.CREDIT_SCORE_DASHBOARD_FACTORS_CLICKED,
        {
          factor_type: factorType,
        }
      );
    }
    if (routePath.endsWith("contact")) {
      return logEventInMixpanel(
        AnalyticEvent.CREDIT_SCORE_DASHBOARD_REPORT_ISSUE_CLICKED
      );
    }
    // INFO: Please change this if we add more cta
    const cta_type = routePath === "/shorts" ? "READ_R_SHORTS" : "COMPLETE_KYC";
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_DASHBOARD_CTA_CLICKED, {
      cta_type,
    });
  }

  function handleCtaClickRouting(navigateTo: string, webviewRoute?: string) {
    handleCtaClickSideEffect(navigateTo);
    const isWebviewInsideRefyneApp = isCurrentlyOnRefyneWebview(
      getValueFromMetadata("appPlatformName")
    );
    if (isWebviewInsideRefyneApp && webviewRoute) {
      return dispatchDataToNativePlatform({
        type: "ROUTE_TO_SCREEN",
        body: {
          screenName: webviewRoute,
        },
      });
    }
    router.push(navigateTo);
  }

  const directlyAccessed = !!router.query["direct"];

  if (syntheticLoader || isLoading) return <CreditReportLoading />;
  return (
    <CreditReportSummary
      creditReport={data?.report ?? null}
      error={error}
      fetchedAt={data?.fetchedAt}
      onCtaClick={handleCtaClickRouting}
      onMount={handleOnMount}
      onRatingTagClick={handleRatingTagClick}
      directAccess={directlyAccessed}
    />
  );
}
