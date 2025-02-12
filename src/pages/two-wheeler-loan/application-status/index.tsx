import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";
import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
import PageLayout from "@/components/PageLayout";
import chevronRight from "@/images/chevron_right.svg";
import styles from "../../two-wheeler-loan/styles.module.css";
import applicationStatusStyles from "./styles.module.css";
import { fetchAllLoans, LoanStatus, VehicleLoan } from "@/lib/two-wheeler-loan";
import { SanctionedDetailsSection } from "@/components/TwoWheelerLoan/ApplicationStatus/SanctionedDetailsSection";
import { ApplicationStatusCard } from "@/components/TwoWheelerLoan/ApplicationStatus/ApplicationStatusCard";
import useFetcher from "@/hooks/useFetcher";
import LoadingPage from "@/components/LoadingPage";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { getRouteHandler } from "@/components/CreditScoreBuilder/helpers";
import { APP_BASE_URL } from "@/constants";
import TwoWheelerLoanConfigData from "../../../../data/two_wheeler_config.json";
import { STATUS_TO_SHOW_APPLICATION_DETAILS_SECTION } from "@/components/TwoWheelerLoan/constants";
import rewardBoxIcon from "../../../../public/assets/images/two-wheeler-loan/green_reward_icon.svg";
import { formatToInr } from "@/lib/utils";

export default function LoanApplicationStatus() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const { isLoading, data: loansData, error } = useFetcher(fetchAllLoans);

  useEffect(() => {
    if (!isLoading && loansData) {
      const { status, id: applicationId } = loansData[0];

      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.BIKE_LOAN_APPLICATION_STATUS_SCREEN_SHOWN,
        {
          status,
          applicationId,
        }
      );
    }
  }, [isLoading, loansData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const status = (loansData && loansData[0].status) || LoanStatus.INITIATED;

  function handleOnClickFooterCTA() {
    const appPlatformName = getValueFromMetadata("appPlatformName");
    const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);

    if (isRefyneWebview) {
      dispatchDataToNativePlatform({
        type: "POP",
      });

      return;
    }
    router.replace(APP_BASE_URL);
  }

  const toShowApplicationDetails =
    STATUS_TO_SHOW_APPLICATION_DETAILS_SECTION.includes(status);

  return (
    <PageLayout
      pageBackground={"var(--clr-background-surface)"}
      hasContentPadding={true}
      hasLocalButton={false}
      hasBackButton={true}
      navbarText="Application Status"
      dispatchPopEventOnBackClick={true}
      onNavbarBackClick={handleOnClickFooterCTA}
      toUnsetOverflowX={true}
      footer={
        <FooterButton
          isButtonDisabled={false}
          label={t("two_wheeler_application_status_footer_cta_label")}
          onClick={handleOnClickFooterCTA}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: status === LoanStatus.REJECTED ? "16px" : "32px",
        }}
      >
        <div>
          <ApplicationStatusCard vehicleLoan={loansData && loansData[0]} />
          {status === LoanStatus.DISBURSED && (
            <RewardDisbursedSection loansData={loansData} />
          )}
        </div>
        {status === LoanStatus.INITIATED && <WhatNextSection />}
        {toShowApplicationDetails && (
          <SanctionedDetailsSection vehicleLoan={loansData && loansData[0]} />
        )}
        <NeedSupportSection />
      </div>
    </PageLayout>
  );
}

const RewardDisbursedSection = ({
  loansData,
}: {
  loansData: VehicleLoan[] | null;
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const idToken = getValueFromMetadata("idToken");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);
  const FAQ_URL = `${APP_BASE_URL}/#/?next=referral/scratch-cards`;

  const routeToFaqClick = getRouteHandler({
    navigateTo: FAQ_URL,
    isRefyneWebview,
    router,
    idToken,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const approvalDetailAmount =
    ((loansData && loansData[0].applicationApprovalDetails?.amount) ?? 0) *
    0.01;

  const rewardCashbackAmount = formatToInr(approvalDetailAmount);

  return (
    <div
      className={styles.outer_wrapper}
      style={{
        justifyContent: "space-between",
        alignItems: "start",
        cursor: "pointer",
      }}
      onClick={routeToFaqClick}
    >
      <div style={{ display: "flex", gap: "8px" }}>
        <Image src={rewardBoxIcon} alt="reward box" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <p className={applicationStatusStyles.need_support__title}>
            {t("congratulations_title")}
          </p>
          <p className={applicationStatusStyles.reward_amount_section_content}>
            {t("application_status_reward_section_cashback", {
              rewardCashbackAmount,
            })}
          </p>
          <p className={applicationStatusStyles.reward_amount_section_content}>
            {t("application_status_reward_click_to_see_reward")}
          </p>
        </div>
      </div>
      <Image src={chevronRight} alt="right arrow" />
    </div>
  );
};

const NeedSupportSection = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const idToken = getValueFromMetadata("idToken");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);
  const FAQ_URL = `${APP_BASE_URL}/#/?next=faq/questions/${encodeURIComponent(
    TwoWheelerLoanConfigData.twoWheelerLoanFaqId
  )}`;

  const routeToFaqClick = getRouteHandler({
    navigateTo: FAQ_URL,
    isRefyneWebview,
    router,
    idToken,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  function handleFaqClicked() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.BIKE_LOAN_FAQS_CLICKED,
      {
        source: "Application Submitted",
      }
    );
    routeToFaqClick();
  }

  return (
    <div>
      <p className={applicationStatusStyles.need_support__title}>
        {t("application_status_need_support")}
      </p>
      <div
        className={styles.outer_wrapper}
        style={{
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={handleFaqClicked}
      >
        <p className={applicationStatusStyles.need_support__faq}>
          {t("application_status_faqs")}
        </p>
        <Image src={chevronRight} alt="right arrow" />
      </div>
    </div>
  );
};

const WhatNextSection = () => {
  const { t } = useTranslation("common");

  const WhatsNextData = [
    t("application_status_whats_next_step_1"),
    t("application_status_whats_next_step_2"),
    t("application_status_whats_next_step_3"),
  ];

  return (
    <div>
      <p className={applicationStatusStyles.whats_next__title}>
        {t("application_status_whats_next")}
      </p>
      <div
        className={styles.outer_wrapper}
        style={{
          flexDirection: "column",
        }}
      >
        {WhatsNextData.map((item, index) => {
          return (
            <div
              key={index}
              className={`${applicationStatusStyles.whats_next__item} ${
                index !== WhatsNextData.length - 1 &&
                applicationStatusStyles.whats_next__item__bordered
              }`}
            >
              <div className={applicationStatusStyles.whats_next__number}>
                {index + 1}
              </div>
              <p className={applicationStatusStyles.whats_next__description}>
                {item}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
