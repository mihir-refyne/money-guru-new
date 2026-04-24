import { useEffect, useMemo, useRef, useState } from "react";
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
  handlePendingCreditReportResponse,
  isAlternateNumberVerificationPending,
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
  const cachePreferred = useRef<boolean>(true);
  const { isLoading, data, error, refetch } = useFetcher(() => {
    const { from, to } = getCreditReportAnalysisPeriod();
    return getOrFetchCreditReportWithAnalysis({
      fromMonthYear: from,
      toMonthYear: to,
      cachePreferred: cachePreferred.current,
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

  useEffect(() => {
    if (!data) return;
    if (isAlternateNumberVerificationPending(data)) {
      handlePendingCreditReportResponse(data);
    }
  }, [data, router]);

  function handleOnMount(context?: { rating?: string; hasExpired?: boolean }) {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.CREDIT_SCORE_DASHBOARD_SCREEN,
      {
        rating: context?.rating,
        is_expired: context?.hasExpired,
        cache_preferred: cachePreferred.current,
        has_data: data !== null,
        error: error?.toString(),
        error_name: error?.name,
        error_message: error?.message,
        error_status_code: (error as any)?.statusCode,
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

  async function handleRefetch() {
    cachePreferred.current = false;
    await refetch(true);
    cachePreferred.current = true;
  }

  const directlyAccessed = !!router.query["direct"];
  const isPending = isAlternateNumberVerificationPending(data);

  if (syntheticLoader || isLoading) return <CreditReportLoading />;

  const creditReportData = isAlternateNumberVerificationPending(data)
    ? null
    : data;

  return (
    <CreditReportSummaryShort
      creditReport={creditReportData?.report ?? null}
      creditReportAnalysis={creditReportData?.analysis ?? null}
      error={error}
      isPending={isPending || undefined}
      vendor={creditReportData?.vendor}
      lender={creditReportData?.lenderId}
      fetchedAt={creditReportData?.fetchedAt}
      expiresAt={creditReportData?.expiresAt}
      hasExpired={creditReportData?.hasExpired}
      isConsumerNotFound={creditReportData?.isConsumerNotFound}
      onCtaClick={handleCtaClickRouting}
      onMount={handleOnMount}
      onRatingTagClick={handleRatingTagClick}
      onRefetchClick={handleRefetch}
      directAccess={directlyAccessed}
      banners={carouselBanners}
      tools={creditReportTools}
    />
  );
}
