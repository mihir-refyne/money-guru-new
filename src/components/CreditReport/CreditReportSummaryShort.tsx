import { useEffect, useState } from "react";
import InfoCard from "../InfoCard";
import CreditReportLayout from "./CreditReportLayout";
import {
  CreditReport,
  CreditReportAnalysis,
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

interface CreditReportSummaryShortProps {
  creditReport: CreditReport | null;
  creditReportAnalysis: CreditReportAnalysis | null;
  error: Error | null;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
  fetchedAt?: string;
  expiresAt?: string;
  directAccess?: boolean;
  banners?: Array<BannerProps & { name: string }>;
  tools?: Array<CreditReportTool>;
  onMount?: (context: { rating?: string }) => void;
  onRatingTagClick?: (rating?: string) => void;
}

export default function CreditReportSummaryShort({
  creditReport,
  creditReportAnalysis,
  error,
  onCtaClick,
  fetchedAt,
  expiresAt,
  onMount,
  directAccess,
  banners = [],
  tools = [],
  onRatingTagClick,
}: CreditReportSummaryShortProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const [isExplainerActive, setIsExplainerActive] = useState<boolean>(false);

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
    onMount?.({ rating: creditReport?.scoreDetails[0]?.rating });
  }, []);

  const isCreditScoreIncrementAnimationShown =
    isCreditScoreIncrementEffectShown();

  return (
    <CreditReportLayout
      navbarText={t("credit_score")}
      transparentNavbar
      hasContentPadding={false}
      dispatchPopEventOnBackClick={directAccess}
    >
      <CreditScore
        score={creditReport?.scoreDetails[0]}
        scoreDifference={currentMonthScoreDifference}
        error={error}
        fetchedAt={fetchedAt}
        expiresAt={expiresAt}
        autoIncrementEffect={!isCreditScoreIncrementAnimationShown}
        onTagClick={handleExplainerOpen}
        onCtaClick={onCtaClick}
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
