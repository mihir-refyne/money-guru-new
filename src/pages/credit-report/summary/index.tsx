import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import CreditReportLoading from "@/components/CreditReport/CreditReportLoading";
import CreditReportSummaryShort from "@/components/CreditReport/CreditReportSummaryShort";
import useFetcher from "@/hooks/useFetcher";
import useSyntheticLoader from "@/hooks/useSyntheticLoader";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import {
  getOrFetchCreditReportWithAnalysis,
  isCreditReportThereInSessionStorage,
} from "@/lib/credit-report";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import creditReportConfig from "../../../../data/credit_report_config.json";
import { checkIfFeatureEnabledByReleaseConfig } from "@/lib/core/release-config";
import type { CreditReportTool } from "@/components/CreditReport/CreditReportToolsTile";
import { getCreditReportAnalysisPeriod } from "@/components/CreditReport/helpers";

export default function CreditReportSummaryPage() {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(() => {
    const { from, to } = getCreditReportAnalysisPeriod();
    return getOrFetchCreditReportWithAnalysis({
      fromMonthYear: from,
      toMonthYear: to,
    });
  });
  const { isLoading: syntheticLoader, setIsLoading } = useSyntheticLoader(
    false,
    3 * 1000
  );

  const employerId = getValueFromMetadata("employerId");
  const workerId = getValueFromMetadata("workerId");

  const carouselBanners = useMemo(() => {
    return (creditReportConfig?.carouselBanner as any)?.banners?.filter(
      (banner: any) => {
        if (!banner.releaseConfig) return true;
        return checkIfFeatureEnabledByReleaseConfig(banner.releaseConfig, {
          employerId,
          workerId,
        });
      }
    );
  }, [creditReportConfig?.carouselBanner, employerId, workerId]);

  const creditReportTools = useMemo<Array<CreditReportTool>>(
    () =>
      creditReportConfig.tools.filter((tool: any) => {
        const releaseConfigs = tool.releaseConfigs;
        if (!Array.isArray(releaseConfigs)) return true;
        return releaseConfigs.some((releaseConfig) =>
          checkIfFeatureEnabledByReleaseConfig(releaseConfig, {
            employerId,
            workerId,
          })
        );
      }),
    [creditReportConfig.tools, employerId, workerId]
  );

  useEffect(() => {
    if (isCreditReportThereInSessionStorage()) return;
    setIsLoading(true);
  }, []);

  function handleOnMount(context?: { rating?: string }) {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.CREDIT_SCORE_DASHBOARD_SCREEN,
      {
        rating: context?.rating,
      }
    );
  }

  function handleRatingTagClick(rating?: string) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_RATING_TAG_CLICKED, {
      rating,
      screen_name: "DASHBOARD",
    });
  }

  function handleCtaClickSideEffect(routePath: string) {
    const isCreditReportClicked = routePath.startsWith("/credit-report");
    // INFO: Please change this if we add more cta
    const cta_type = isCreditReportClicked
      ? "SEE_FULL_REPORT"
      : routePath.startsWith("/shorts")
      ? "READ_R_SHORTS"
      : "COMPLETE_KYC";
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
    <CreditReportSummaryShort
      creditReport={data?.report ?? null}
      creditReportAnalysis={data?.analysis ?? null}
      error={error}
      fetchedAt={data?.fetchedAt}
      expiresAt={data?.expiresAt}
      onCtaClick={handleCtaClickRouting}
      onMount={handleOnMount}
      onRatingTagClick={handleRatingTagClick}
      directAccess={directlyAccessed}
      banners={carouselBanners}
      tools={creditReportTools}
    />
  );
}
