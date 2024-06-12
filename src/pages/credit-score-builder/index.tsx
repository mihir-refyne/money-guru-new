import CreditScoreBuilderFooter from "@/components/CreditScoreBuilder/CreditScoreBuilderFooter";
import CreditScoreBuilderHome from "@/components/CreditScoreBuilder/CreditScoreBuilderHome";
import { CreditScoreBuilderProgress } from "@/components/CreditScoreBuilder/CreditScoreProgressSection";
import { getRouteHandler } from "@/components/CreditScoreBuilder/helpers";
import LoadingPage from "@/components/LoadingPage";
import PageLayout from "@/components/PageLayout";
import { APP_BASE_URL, CDN_BASE_URL, CORE_SERVER_BASE_URL } from "@/constants";
import useFetcher from "@/hooks/useFetcher";
import useTranslation from "@/hooks/useTranslation";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { UserStatus } from "@/lib/core/user";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { fetcher } from "@/lib/fetcher";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

export default function CreditReportBuilder() {
  const userStatus = getValueFromMetadata("status") as UserStatus;
  const idToken = getValueFromMetadata("idToken");

  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);

  const router = useRouter();

  const handleCompleteKyc = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/?next=startActivation`,
    webviewRoute: "accountActivation",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const handleInCompleteKyc = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/?next=incompleteInfo`,
    webviewRoute: "incompleteInfo",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const handleViewReport = getRouteHandler({
    navigateTo: "/credit-report/summary",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const handleVerificationPending = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/`,
    webviewRoute: "dashboard",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const handleWithdraw = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/?next=lending-products`,
    webviewRoute: "lendingProductsPage",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const { data: userStatusData, isLoading } = useFetcher(() => {
    return fetcher<Record<string, string>>(
      `${CDN_BASE_URL}/credit-score-builder/userstatus.json`
    );
  });

  const { data: userTransactionInfo } = useFetcher(() => {
    return fetcher<Record<string, any>>(
      `${CORE_SERVER_BASE_URL}/user/user-withdraw-and-transaction-info?is-withdraw-activation=false`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "x-app-version": "1",
        },
      }
    );
  });

  const userId = getValueFromMetadata("id");

  const currentUserProgress = useMemo(() => {
    if (!userId) return;
    let progressKey = userStatusData?.data[userId];
    if (
      !progressKey &&
      userTransactionInfo?.data?.hasPerformedSuccessFullTransaction
    ) {
      progressKey = "REPAYMENT_PENDING";
    }
    return CreditScoreBuilderProgress[
      progressKey as keyof typeof CreditScoreBuilderProgress
    ];
  }, [userStatusData, userId, userTransactionInfo]);

  const { t } = useTranslation("common");

  useEffect(() => {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE
    );
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <PageLayout
      navbarText={t("credit_score_builder_nav_text")}
      hasLocaleChange={false}
      hasShare={false}
      hasContentPadding={false}
      dispatchPopEventOnBackClick
      footer={
        <CreditScoreBuilderFooter
          userStatus={userStatus}
          currentUserProgress={currentUserProgress}
          onCompleteKyc={handleCompleteKyc}
          onIncompleteKyc={handleInCompleteKyc}
          onViewReport={handleViewReport}
          onWithdraw={handleWithdraw}
          onVerificationPending={handleVerificationPending}
        />
      }
    >
      <CreditScoreBuilderHome currentUserProgress={currentUserProgress} />
    </PageLayout>
  );
}
