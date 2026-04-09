import CreditReportLoading from "@/components/CreditReport/CreditReportLoading";
import CreditReportSummaryDetailed from "@/components/CreditReport/CreditReportSummaryDetailed";
import { getCreditReportAnalysisPeriod } from "@/components/CreditReport/helpers";
import useFetcher from "@/hooks/useFetcher";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import {
  getOrFetchCreditReportWithAnalysis,
  isCreditReportThereInSessionStorage,
  CreditReportPendingResponse,
  CreditReportAnalysisPendingResponse,
} from "@/lib/credit-report";
import { getShortsByLocale } from "@/lib/shorts/server";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import config from "../../../../data/credit_report_config.json";

interface CreditReportSummaryDetailedPage {
  shorts: Array<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
  }>;
}

export const getStaticProps: GetStaticProps<
  CreditReportSummaryDetailedPage
> = async (context) => {
  const { locale = "en" } = context;
  const shorts = await getShortsByLocale(locale);

  return {
    props: {
      shorts,
    },
  };
};

export default function CreditReportSummaryDetailedPage({
  shorts,
}: CreditReportSummaryDetailedPage) {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(() => {
    const { from, to } = getCreditReportAnalysisPeriod();
    return getOrFetchCreditReportWithAnalysis({
      fromMonthYear: from,
      toMonthYear: to,
      cachePreferred: true,
    });
  });

  const shortsToBeFeatured = useMemo<
    Array<{
      id: string;
      metadata: Record<string, unknown>;
      content: string;
    }>
  >(() => {
    const shortsToBeFeaturedFromConfig =
      config?.featuredShort?.shortsToBeFeatured ?? [];

    const shortsToBeFeaturedFromConfigIndexes: number[] =
      shortsToBeFeaturedFromConfig
        .map((shortId) => {
          return shorts.findIndex((val) => val.id === shortId);
        })
        .filter((val) => val >= 0);

    const shortsToBeFeatured = shortsToBeFeaturedFromConfigIndexes.map(
      (shortIndex) => shorts[shortIndex]
    );
    return shortsToBeFeatured;
  }, [shorts]);

  const featuredShortCarouselAutoPlayDuration: number | undefined =
    config.featuredShort?.autoPlayDurationInMs;

  useEffect(() => {
    if (isCreditReportThereInSessionStorage()) return;
    if (!data) return;

    // Handle pending response - redirect to alternate number page
    if ("fetchCompleted" in data && !data.fetchCompleted) {
      const pendingResponse = data as
        | CreditReportPendingResponse
        | CreditReportAnalysisPendingResponse;
      const challengeData = pendingResponse.data.sendOtpChallenge;
      if (challengeData) {
        sessionStorage.setItem(
          "__CreditBureauChallenge",
          JSON.stringify({
            requestId: pendingResponse.data.requestId,
            requestContext: {
              challengeConfigGuid: challengeData.challengeConfigGuid,
              questionKey: challengeData.questionKey,
              answerKey: challengeData.answerKey,
            },
          })
        );
      }
      // Removed auto-redirect to /alternate-number
      // router.replace("/alternate-number");
    }
  }, [data, router]);

  // TODO: Get clarified if required
  function handleOnMount(context?: { rating?: string }) {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.CREDIT_SCORE_FULL_REPORT_SCREEN
    );
  }

  function handleRatingTagClick(rating?: string) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_RATING_TAG_CLICKED, {
      rating,
      screen_name: "FULL_REPORT",
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

  function handleFeaturedShortClick(id: string) {
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.CREDIT_SCORE_FULL_REPORT_R_SHORTS_CAROUSAL_CLICKED,
      {
        short_id: id,
      }
    );
    router.push({
      pathname: "/shorts-old",
      hash: id,
    });
  }

  const directlyAccessed = !!router.query["direct"];
  const isPending = data && "fetchCompleted" in data && !data.fetchCompleted;

  if (isLoading || isPending) return <CreditReportLoading />;

  if (!data || "fetchCompleted" in data) return null;

  if (!data?.report) return null;

  return (
    <CreditReportSummaryDetailed
      creditReport={data?.report}
      creditReportAnalysis={data?.analysis}
      onCtaClick={handleCtaClickRouting}
      onMount={handleOnMount}
      onRatingTagClick={handleRatingTagClick}
      directAccess={directlyAccessed}
      featuredShortCarouselAutoPlayDuration={
        featuredShortCarouselAutoPlayDuration
      }
      shortsToBeFeatured={shortsToBeFeatured}
      onFeaturedShortClick={handleFeaturedShortClick}
    />
  );
}
