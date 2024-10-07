import { useEffect, useState } from "react";
import Image from "next/image";
import InfoCard from "../InfoCard";
import CreditReportLayout from "./CreditReportLayout";
import ListCard, { ListCardItemProps } from "../ListCard";
import {
  CreditReport,
  CumulativeMetricsForPaymentHistory,
  CumulativeMetricsForCreditUsage,
  CumulativeMetricsForCreditMix,
  CumulativeMetricsForEnquiry,
  CreditReportAnalysis,
} from "@/lib/credit-report";
import rupeeReloadIconUrl from "@/images/rupee_reload.svg";
import walletIconUrl from "@/images/wallet.svg";
import moneyBagIconUrl from "@/images/money_bag.svg";
import cardWaitingIconUrl from "@/images/card_waiting.svg";
import cardSearchIconUrl from "@/images/card_search.svg";
import Modal from "../Modal";
import CreditReportMetricsExplainer, {
  CreditReportMetricsExplainerProps,
} from "./CreditReportMetricsExplainer";
import {
  checkIfAnyFactorChanged,
  getColorByCreditMetricRating,
  getTagTypeByCreditMetricRating,
} from "./helpers";
import CreditScoreExplainerData from "../../../data/credit_score_explainer.json";
import { CaretDoubleRight, Info, Question } from "phosphor-react";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import useTranslation from "@/hooks/useTranslation";
import Card from "../Card";
import Separator from "../Separator";
import Tag from "../Tag";
import Carousel from "../Carousel";
import FeaturedShort from "../Shorts/FeaturedShort";
import { getLastItemOfArray } from "@/lib/utils";
import CreditScoreDifferenceText from "./CreditScoreDifferenceText";
import CreditReportFactorChangeView from "./CreditReportFactorChangeView";

interface CreditReportSummaryDetailedProps {
  creditReport: CreditReport;
  creditReportAnalysis?: CreditReportAnalysis;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
  directAccess?: boolean;
  onMount?: (context: { rating?: string }) => void;
  onRatingTagClick?: (rating?: string) => void;
  featuredShortCarouselAutoPlayDuration?: number;
  shortsToBeFeatured: Array<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
  }>;
  onFeaturedShortClick?: (id: string) => void;
}

export default function CreditReportSummaryDetailed({
  creditReport,
  creditReportAnalysis,
  onCtaClick,
  onMount,
  directAccess,
  onRatingTagClick,
  featuredShortCarouselAutoPlayDuration,
  shortsToBeFeatured,
  onFeaturedShortClick,
}: CreditReportSummaryDetailedProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const [isExplainerActive, setIsExplainerActive] = useState<boolean>(false);
  const [
    isFactorChangeDisplayModalActive,
    setIsFactorChangeDisplayModalActive,
  ] = useState<boolean>(false);

  const scoreDetails = creditReport.scoreDetails?.[0];
  const currentMonthScoreDifference =
    getLastItemOfArray(creditReportAnalysis?.creditScoresAnalysis ?? [])
      ?.differenceFromLastFetchedScore ?? null;

  const hasPreviousReport = currentMonthScoreDifference !== null;
  const hasAnyFactorChanged = checkIfAnyFactorChanged(
    creditReportAnalysis?.metricsAnalysis
  );

  function handleExplainerOpen() {
    onRatingTagClick?.(scoreDetails?.rating);
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
  function handleSectionClick(routePath: string) {
    return () => onCtaClick(routePath);
  }

  function handleFactorChangeDisplayModalOpen() {
    setIsFactorChangeDisplayModalActive(true);
  }
  function handleFactorChangeDisplayModalClose() {
    setIsFactorChangeDisplayModalActive(false);
  }

  useEffect(() => {
    onMount?.({ rating: scoreDetails?.rating });
  }, []);

  function getPaymentHistoryListCardProps(
    paymentHistory?: CumulativeMetricsForPaymentHistory,
    onClick?: () => void
  ): ListCardItemProps {
    return {
      leftIcon: <Image src={rupeeReloadIconUrl} alt="Payment History" />,
      contentLeftTitle: t("payment_history_label"),
      contentLeftDescription: t("high_impact_label"),
      contentRightTitle: paymentHistory?.onTimePaymentPercentage,
      contentRightDescription:
        paymentHistory?.rating.replaceAll("_", " ").toLowerCase() ?? "NA",
      contentRightDescriptionFontColor:
        paymentHistory && getColorByCreditMetricRating(paymentHistory?.rating),
      onClick: paymentHistory && onClick,
    };
  }

  function getCreditUtilisationListCardProps(
    creditUsage?: CumulativeMetricsForCreditUsage,
    onClick?: () => void
  ): ListCardItemProps {
    return {
      leftIcon: <Image src={walletIconUrl} alt="Credit Utilisation" />,
      contentLeftTitle: t("credit_utilisation_label"),
      contentLeftDescription: t("high_impact_label"),
      contentRightTitle: creditUsage?.totalCreditUsageInPercent,
      contentRightDescription:
        creditUsage?.rating.replaceAll("_", " ").toLowerCase() ?? "NA",
      contentRightDescriptionFontColor:
        creditUsage && getColorByCreditMetricRating(creditUsage?.rating),
      onClick: creditUsage && onClick,
    };
  }

  function getCreditMixListCardProps(
    creditMix?: CumulativeMetricsForCreditMix,
    onClick?: () => void
  ): ListCardItemProps {
    return {
      leftIcon: <Image src={cardWaitingIconUrl} alt="Credit Mix" />,
      contentLeftTitle: t("credit_mix_label"),
      contentLeftDescription: t("medium_impact_label"),
      contentRightTitle: creditMix && t("credit_mix_summary", creditMix),
      contentRightDescription:
        creditMix?.rating.replaceAll("_", " ").toLowerCase() ?? "NA",
      contentRightDescriptionFontColor:
        creditMix && getColorByCreditMetricRating(creditMix?.rating),
      onClick: creditMix && onClick,
    };
  }

  function getCreditEnquiriesListCardProps(
    enquiries?: CumulativeMetricsForEnquiry,
    onClick?: () => void
  ): ListCardItemProps {
    return {
      leftIcon: <Image src={cardSearchIconUrl} alt="Credit Enquiries" />,
      contentLeftTitle: t("credit_enquiries_label"),
      contentLeftDescription: t("low_impact_label"),
      contentRightTitle: enquiries?.totalEnquiries?.toString(),
      contentRightDescription:
        enquiries?.rating.replaceAll("_", " ").toLowerCase() ?? "NA",
      contentRightDescriptionFontColor:
        enquiries && getColorByCreditMetricRating(enquiries?.rating),
      onClick: enquiries && onClick,
    };
  }

  function getTotalAccountsListCardProps(
    creditMix?: CumulativeMetricsForCreditMix,
    onClick?: () => void
  ): ListCardItemProps {
    const totalAccounts =
      creditMix &&
      creditMix.totalActiveCreditCards + creditMix.totalActiveLoans;
    return {
      leftIcon: <Image src={moneyBagIconUrl} alt="Total Accounts" />,
      contentLeftTitle: t("total_accounts_label"),
      contentLeftDescription: t("low_impact_label"),
      contentRightTitle: totalAccounts?.toString(),
      contentRightDescription:
        creditMix?.rating.replaceAll("_", " ").toLowerCase() ?? "NA",
      contentRightDescriptionFontColor:
        creditMix && getColorByCreditMetricRating(creditMix?.rating),
      onClick: creditMix && onClick,
    };
  }

  const refyneAppSupportPageUrl =
    (process.env.NEXT_PUBLIC_APP_BASE_URL ?? "https://app.refyne.co.in/") +
    "#/?next=/contact";
  const refyneAppSupportPageRouteId = "support";

  const hasFeaturedShorts = shortsToBeFeatured.length > 0;
  if (!scoreDetails) return null;

  const ScoreDetailsElem = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h4 className="text-heading text-medium mb-2">{t("credit_score")}</h4>
        <Tag
          type={getTagTypeByCreditMetricRating(scoreDetails?.rating)}
          rightIcon={<Info size={16} />}
          onClick={handleExplainerOpen}
        >
          {scoreDetails?.rating.replaceAll("_", " ")}
        </Tag>
      </div>
      <div>
        <h2 className="text-title text-semi-bold">{scoreDetails.score}</h2>
        <p className="text-caption clr-text-secondary">out of 900</p>
      </div>
    </div>
  );

  const CardFooterElem = hasAnyFactorChanged ? (
    <button
      className=" btn-block flex-center text-caption text-semibold clr-brand-default"
      onClick={handleFactorChangeDisplayModalOpen}
    >
      <span className="mr-1">{t("credit_report_see_what_changed")}</span>
      <CaretDoubleRight />
    </button>
  ) : !hasPreviousReport ? (
    <p className="text-center clr-text-secondary">
      {t("track_score_trends_next_month")}
    </p>
  ) : null;

  return (
    <CreditReportLayout
      navbarText={t("credit_score")}
      dispatchPopEventOnBackClick={directAccess}
    >
      <div className="mb-4">
        <Card
          backgroundColor="var(--clr-grey-light)"
          footerBackgroundColor="#EBF5FF"
          footer={CardFooterElem}
        >
          {/* TODO: Maybe find more elegent way to do this */}
          {currentMonthScoreDifference !== null ? (
            <Separator
              orientation="vertical"
              separatorColor="var(--clr-grey-default)"
              spacing={3}
            >
              {ScoreDetailsElem}
              <div>
                <CreditScoreDifferenceText className="text-caption">
                  {currentMonthScoreDifference}
                </CreditScoreDifferenceText>
              </div>
            </Separator>
          ) : (
            ScoreDetailsElem
          )}
        </Card>
      </div>
      <h2 className="text-heading text-semibold mb-2">
        {t("credit_factors_label")}
      </h2>
      <h4 className="text-caption text-regular clr-text-secondary">
        {t("factors_impacting_score")}
      </h4>
      <div className="mt-4 mb-2">
        <ListCard
          className="mb-4"
          items={[
            getPaymentHistoryListCardProps(
              creditReport?.metrics?.paymentHistory,
              handleSectionClick("/credit-report/payment-history")
            ),
          ]}
        />
        <ListCard
          className="mb-4"
          items={[
            getCreditUtilisationListCardProps(
              creditReport?.metrics?.creditUsage,
              handleSectionClick("/credit-report/credit-utilisation")
            ),
          ]}
        />
        <ListCard
          className="mb-4"
          items={[
            getCreditMixListCardProps(
              creditReport?.metrics?.creditMix,
              handleSectionClick("/credit-report/credit-mix")
            ),
          ]}
        />
        <ListCard
          className="mb-4"
          items={[
            getCreditEnquiriesListCardProps(
              creditReport?.metrics?.enquiries,
              handleSectionClick("/credit-report/enquiries")
            ),
          ]}
        />
        <ListCard
          className="mb-4"
          items={[
            getTotalAccountsListCardProps(
              creditReport?.metrics?.creditMix,
              handleSectionClick("/credit-report/accounts")
            ),
          ]}
        />
      </div>

      <InfoCard>{t("credit_card_activity_delay")}</InfoCard>

      <button
        className="btn btn-text btn-inline flex-center my-2"
        onClick={() =>
          onCtaClick(refyneAppSupportPageUrl, refyneAppSupportPageRouteId)
        }
      >
        <Question size={16} className="mr-1" />
        <span>{t("report_issue_btn")}</span>
      </button>

      {hasFeaturedShorts && (
        <>
          <h2 className="text-heading text-semibold my-4">
            {t("learn_more_credit_score")}
          </h2>
          <Carousel
            autoPlay={!!featuredShortCarouselAutoPlayDuration}
            infiniteLoop
            interval={featuredShortCarouselAutoPlayDuration}
            showIndicators={shortsToBeFeatured.length > 1}
          >
            {shortsToBeFeatured.map((shortItem) => {
              return (
                <div key={shortItem.id} className="mb-8">
                  <FeaturedShort
                    mediaType={(shortItem.metadata?.mediaType ?? "") as string}
                    mediaUrl={(shortItem.metadata?.mediaUrl ?? "") as string}
                    onClick={() => onFeaturedShortClick?.(shortItem.id)}
                    content={shortItem.content ?? ""}
                  />
                </div>
              );
            })}
          </Carousel>
        </>
      )}

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
      <Modal
        active={isFactorChangeDisplayModalActive}
        bottomSheetOnMobile
        onClose={handleFactorChangeDisplayModalClose}
      >
        <CreditReportFactorChangeView
          creditReportAnalysis={creditReportAnalysis}
          onPrimaryCtaClick={handleFactorChangeDisplayModalClose}
        />
      </Modal>
    </CreditReportLayout>
  );
}
