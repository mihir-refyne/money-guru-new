import { APP_BASE_URL } from "@/constants";
import useTranslation from "@/hooks/useTranslation";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { UserStatus } from "@/lib/core/user";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { useRouter } from "next/router";
import CreditScoreProgressCard from "./CreditScoreProgressCard";
import styles from "./CreditScoreProgressSection.module.css";
import { getRouteHandler } from "./helpers";

export enum CreditScoreBuilderProgress {
  "WITHDRAWAL_PENDING",
  "REPAYMENT_PENDING",
  "CREDIT_REPORT_PENDING",
  "CREDIT_REPORT_GENERATED",
}

export default function CreditScoreProgressSection({
  currentWithdrawalStatus = CreditScoreBuilderProgress.WITHDRAWAL_PENDING,
}: {
  currentWithdrawalStatus?: CreditScoreBuilderProgress;
}) {
  const idToken = getValueFromMetadata("idToken");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);

  const router = useRouter();

  const routeToCompleteKyc = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/?next=startActivation`,
    webviewRoute: "accountActivation",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const routeToInCompleteKyc = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/?next=incompleteInfo`,
    webviewRoute: "incompleteInfo",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const routeToViewReport = getRouteHandler({
    navigateTo: "/credit-report/summary",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const routeToWithdrawal = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/?next=lending-products`,
    webviewRoute: "lendingProductsPage",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const routeToDashboard = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/`,
    webviewRoute: "dashboard",
    isRefyneWebview,
    idToken,
    router,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const userStatus = getValueFromMetadata("status") as UserStatus;
  const action = getActionOnUserStatus(userStatus);

  function handleWithdraw() {
    if (action === "WITHDRAW") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "MILESTONES",
          cta: "WITHDRAW",
        }
      );
      return routeToWithdrawal();
    }
    if (action === "KYC_PENDING") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "MILESTONES",
          cta: "COMPLETE_KYC",
        }
      );
      return routeToCompleteKyc();
    }
    if (action === "KYC_INCOMPLETE") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "MILESTONES",
          cta: "INCOMPLETE_KYC",
        }
      );
      return routeToInCompleteKyc();
    }
    if (action === "KYC_VERIFICATION_PENDING") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "MILESTONES",
          cta: "VERIFICATION_PENDING",
        }
      );
      return routeToDashboard();
    }
  }

  function handleViewReport() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
      {
        source: "MILESTONES",
        cta: "CREDIT_SCORE",
      }
    );
    routeToViewReport();
  }

  const { t } = useTranslation("common");

  return (
    <div className="px-3">
      <h2 className="text-heading-small px-3">
        {t("credit_score_builder_milestones_title")}
      </h2>
      <p
        className="text-body px-3"
        style={{
          color: "var(--clr-text-secondary)",
        }}
      >
        {t("credit_score_builder_milestones_desc")}
      </p>
      <div className={styles.CreditScoreProgressSection__CardContainer}>
        <CreditScoreProgressCard
          title={t("credit_score_builder_milestones_one_title")}
          desc={t("credit_score_builder_milestones_one_desc")}
          progress={currentWithdrawalStatus}
          type="withdrawal"
          onClick={handleWithdraw}
        />
        <CreditScoreProgressCard
          title={t("credit_score_builder_milestones_two_title")}
          desc={t("credit_score_builder_milestones_two_desc")}
          progress={currentWithdrawalStatus}
          type="repayment"
        />
        <CreditScoreProgressCard
          title={t("credit_score_builder_milestones_three_title")}
          desc={t("credit_score_builder_milestones_three_desc")}
          progress={currentWithdrawalStatus}
          type="view_report"
          onClick={handleViewReport}
        />
      </div>
    </div>
  );
}

function getActionOnUserStatus(userStatus: UserStatus) {
  if (
    userStatus === UserStatus.VERIFICATION_PENDING ||
    userStatus === UserStatus.USER_MODIFIED_VERIFICATION_PENDING
  ) {
    return "KYC_VERIFICATION_PENDING";
  }
  if (
    userStatus === UserStatus.INCOMPLETE_INFO ||
    userStatus === UserStatus.USER_MODIFIED_INCORRECT_INFO
  ) {
    return "KYC_INCOMPLETE";
  }
  if (
    userStatus === UserStatus.INITIATED ||
    userStatus === UserStatus.SALARY_VIEWABLE
  ) {
    return "KYC_PENDING";
  }
  if (userStatus === UserStatus.REFYNE_VERIFIED) {
    return "WITHDRAW";
  }
}
