import { useEffect, useState } from "react";
import InfoCard from "../InfoCard";
import CreditReportLayout from "./CreditReportLayout";
import {
  CreditReport,
  CreditReportAnalysis,
  CreditBureauVendor,
  isCreditScoreIncrementEffectShown,
} from "@/lib/credit-report";
import CreditScore from "./CreditScore";
import Modal from "../Modal";
import CreditReportMetricsExplainer, {
  CreditReportMetricsExplainerProps,
} from "./CreditReportMetricsExplainer";
import CreditScoreExplainerData from "../../../data/credit_score_explainer.json";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import useTranslation from "@/hooks/useTranslation";
import Banner, { BannerProps } from "../Banner";
import Carousel from "../Carousel";
import { getLastItemOfArray } from "@/lib/utils";
import CreditReportToolsTile, {
  type CreditReportTool,
} from "./CreditReportToolsTile";
import CreditReportFetchConsent from "./CreditReportFetchConsent";

interface CreditReportSummaryShortProps {
  creditReport: CreditReport | null;
  creditReportAnalysis: CreditReportAnalysis | null;
  error: Error | null;
  isPending?: boolean;
  vendor?: CreditBureauVendor;
  lender?: string;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
  fetchedAt?: string;
  expiresAt?: string;
  hasExpired?: boolean;
  directAccess?: boolean;
  banners?: Array<BannerProps & { name: string }>;
  tools?: Array<CreditReportTool>;
  onMount?: (context: { rating?: string; hasExpired?: boolean }) => void;
  onRatingTagClick?: (rating?: string) => void;
  onRefetchClick?: () => void;
  isConsumerNotFound?: boolean;
}

export default function CreditReportSummaryShort({
  creditReport,
  creditReportAnalysis,
  error,
  isPending,
  vendor,
  lender,
  onCtaClick,
  fetchedAt,
  expiresAt,
  hasExpired,
  onMount,
  directAccess,
  banners = [],
  tools = [],
  onRatingTagClick,
  onRefetchClick,
  isConsumerNotFound,
}: CreditReportSummaryShortProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const [isExplainerActive, setIsExplainerActive] = useState<boolean>(false);
  const [isRefetchConsentDialogActive, setisRefetchConsentDialogActive] =
    useState<boolean>(false);

  const currentMonthScoreDifference =
    getLastItemOfArray(creditReportAnalysis?.creditScoresAnalysis ?? [])
      ?.differenceFromLastFetchedScore ?? null;

  const hasCarouselBanners = banners.length > 0;
  const hasAnyTools = tools.length > 0;

  function handleExplainerOpen() {
    onRatingTagClick?.(creditReport?.scoreDetails[0]?.rating);
    setIsExplainerActive(true);
  }
  function handleExplainerClose(isCtaClick: boolean = false) {
    logEventInMixpanel(
      AnalyticEvent.CREDIT_SCORE_RATING_TAG_INFO_POPUP_CTA_CLICKED,
      {
        cta_type: isCtaClick ? "GOT_IT" : "CLOSE",
      }
    );
    setIsExplainerActive(false);
  }

  function handleConsentDialogOpen() {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_REFETCH_CTA_CLICKED);
    setisRefetchConsentDialogActive(true);
  }
  function handleConsentDialogClose() {
    setisRefetchConsentDialogActive(false);
  }
  function handleConsentNotNowClick() {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_REFETCH_POPUP_CTA_CLICKED, {
      allowed_refetch: false,
    });
    handleConsentDialogClose();
  }
  function handleConsentContinue() {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_REFETCH_POPUP_CTA_CLICKED, {
      allowed_refetch: true,
    });
    handleConsentDialogClose();
    onRefetchClick?.();
  }

  function handleToolClick(name: string, navigateTo: string) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_DASHBOARD_TOOLS_CTA_CLICKED, {
      tool_name: name,
    });
    onCtaClick(navigateTo);
  }

  function handleCarouselBannerClickSideEffect(name: string, url?: string) {
    return () => {
      logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_DASHBOARD_BANNER_CLICKED, {
        name,
      });
      if (url) onCtaClick(url);
    };
  }

  useEffect(() => {
    onMount?.({ rating: creditReport?.scoreDetails[0]?.rating, hasExpired });
  }, []);

  const isCreditScoreIncrementAnimationShown =
    isCreditScoreIncrementEffectShown();

  // If consumer not found, only show CreditScore component (no banners, tools, etc.)
  if (isConsumerNotFound) {
    return (
      <CreditReportLayout
        navbarText={t("credit_score")}
        transparentNavbar
        hasContentPadding={false}
        dispatchPopEventOnBackClick={directAccess}
        vendor={vendor}
        lender={lender}
      >
        <CreditScore
          score={creditReport?.scoreDetails[0]}
          scoreDifference={currentMonthScoreDifference}
          error={error}
          isPending={isPending}
          fetchedAt={fetchedAt}
          expiresAt={expiresAt}
          hasExpired={hasExpired}
          autoIncrementEffect={!isCreditScoreIncrementAnimationShown}
          onTagClick={handleExplainerOpen}
          onCtaClick={onCtaClick}
          onRefetchClick={handleConsentDialogOpen}
          isConsumerNotFound={isConsumerNotFound}
        />
      </CreditReportLayout>
    );
  }

  return (
    <CreditReportLayout
      navbarText={t("credit_score")}
      transparentNavbar
      hasContentPadding={false}
      dispatchPopEventOnBackClick={directAccess}
      vendor={vendor}
      lender={lender}
    >
      <CreditScore
        score={creditReport?.scoreDetails[0]}
        scoreDifference={currentMonthScoreDifference}
        error={error}
        isPending={isPending}
        fetchedAt={fetchedAt}
        expiresAt={expiresAt}
        hasExpired={hasExpired}
        autoIncrementEffect={!isCreditScoreIncrementAnimationShown}
        onTagClick={handleExplainerOpen}
        onCtaClick={onCtaClick}
        onRefetchClick={handleConsentDialogOpen}
      />
      <div className="px-4">
        <InfoCard>
          <span className="clr-text-primary text-medium">
            {t("credit_dash_info_title")}
          </span>
          <br />
          <span>{t("credit_dash_info_desc")}</span>
        </InfoCard>
        {hasCarouselBanners && (
          <div className={`my-4 ${banners.length > 1 ? "px-0" : ""}`}>
            <Carousel infiniteLoop centerMode centerSlidePercentage={90}>
              {banners.map((banner, index) => (
                <Banner
                  key={index}
                  {...banner}
                  heading={banner.heading && tWithoutTypeSafety(banner.heading)}
                  description={
                    banner.description && tWithoutTypeSafety(banner.description)
                  }
                  ctaLabel={
                    banner.ctaLabel && tWithoutTypeSafety(banner.ctaLabel)
                  }
                  hasHorizontalMargin={banners.length > 1}
                  url={undefined}
                  onClick={handleCarouselBannerClickSideEffect(
                    banner.name,
                    banner.url
                  )}
                />
              ))}
            </Carousel>
          </div>
        )}
        {hasAnyTools && (
          <CreditReportToolsTile tools={tools} onClick={handleToolClick} />
        )}
      </div>

      <Modal
        active={isRefetchConsentDialogActive}
        bottomSheetOnMobile
        onClose={handleConsentDialogClose}
      >
        <CreditReportFetchConsent
          onContinueClick={handleConsentContinue}
          onNotNowClick={handleConsentNotNowClick}
        />
      </Modal>
      <Modal
        active={isExplainerActive}
        bottomSheetOnMobile
        onClose={handleExplainerClose}
      >
        <CreditReportMetricsExplainer
          {...(CreditScoreExplainerData as CreditReportMetricsExplainerProps)}
          ctaLabel={t("got_it_btn")}
          onCtaClick={() => handleExplainerClose(true)}
        />
      </Modal>
    </CreditReportLayout>
  );
}
