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
  isCreditScoreIncrementEffectShown,
} from "@/lib/credit-report";
import rupeeReloadIconUrl from "@/images/rupee_reload.svg";
import walletIconUrl from "@/images/wallet.svg";
import moneyBagIconUrl from "@/images/money_bag.svg";
import cardWaitingIconUrl from "@/images/card_waiting.svg";
import cardSearchIconUrl from "@/images/card_search.svg";
import CreditScore from "./CreditScore";
import Modal from "../Modal";
import CreditReportMetricsExplainer, {
  CreditReportMetricsExplainerProps,
} from "./CreditReportMetricsExplainer";
import { getColorByCreditMetricRating } from "./helpers";
import CreditScoreExplainerData from "../../../data/credit_score_explainer.json";
import { Question } from "phosphor-react";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

interface CreditReportSummaryProps {
  creditReport: CreditReport | null;
  error: Error | null;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
  fetchedAt?: string;
  directAccess?: boolean;
  onMount?: (context: { rating?: string }) => void;
  onRatingTagClick?: (rating?: string) => void;
}

export default function CreditReportSummary({
  creditReport,
  error,
  onCtaClick,
  fetchedAt,
  onMount,
  directAccess,
  onRatingTagClick,
}: CreditReportSummaryProps) {
  const [isExplainerActive, setIsExplainerActive] = useState<boolean>(false);

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
  function handleSectionClick(routePath: string) {
    return () => onCtaClick(routePath);
  }

  useEffect(() => {
    onMount?.({ rating: creditReport?.scoreDetails[0]?.rating });
  }, []);

  const isCreditScoreIncrementAnimationShown = isCreditScoreIncrementEffectShown();

  const refyneAppSupportPageUrl =
    (process.env.NEXT_PUBLIC_APP_BASE_URL ?? "https://app.refyne.co.in/") +
    "#/?next=/contact";
  const refyneAppSupportPageRouteId = "support";

  return (
    <CreditReportLayout
      navbarText="Credit Score"
      dispatchPopEventOnBackClick={directAccess}
    >
      <div className="mb-8">
        <CreditScore
          score={creditReport?.scoreDetails[0]}
          error={error}
          fetchedAt={fetchedAt}
          autoIncrementEffect={!isCreditScoreIncrementAnimationShown}
          onTagClick={handleExplainerOpen}
          onCtaClick={onCtaClick}
        />
      </div>
      <h2 className="text-heading text-semibold mb-2">Credit Factors</h2>
      <h4 className="text-caption text-regular clr-text-secondary">
        See the factors affecting your credit score
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

      <InfoCard>
        It takes up to 4 months before data of your latest credit card activity
        is accounted by the credit bureau.
      </InfoCard>

      <button
        className="btn btn-text btn-inline flex-center my-2"
        onClick={() =>
          onCtaClick(refyneAppSupportPageUrl, refyneAppSupportPageRouteId)
        }
      >
        <Question size={16} className="mr-1" />
        <span>Report an issue</span>
      </button>

      <Modal
        active={isExplainerActive}
        bottomSheetOnMobile
        onClose={handleExplainerClose}
      >
        <CreditReportMetricsExplainer
          {...(CreditScoreExplainerData as CreditReportMetricsExplainerProps)}
          ctaLabel="Got it"
          onCtaClick={() => handleExplainerClose(true)}
        />
      </Modal>
    </CreditReportLayout>
  );
}

function getPaymentHistoryListCardProps(
  paymentHistory?: CumulativeMetricsForPaymentHistory,
  onClick?: () => void
): ListCardItemProps {
  return {
    leftIcon: <Image src={rupeeReloadIconUrl} alt="Payment History" />,
    contentLeftTitle: "Payment History",
    contentLeftDescription: "High impact",
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
    contentLeftTitle: "Credit Utilisation",
    contentLeftDescription: "High impact",
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
    contentLeftTitle: "Credit Mix",
    contentLeftDescription: "Medium impact",
    contentRightTitle:
      creditMix &&
      `${creditMix.totalActiveCreditCards} cards & ${creditMix.totalActiveLoans} loans`,
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
    contentLeftTitle: "Credit Enquiries",
    contentLeftDescription: "Low impact",
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
    creditMix && creditMix.totalActiveCreditCards + creditMix.totalActiveLoans;
  return {
    leftIcon: <Image src={moneyBagIconUrl} alt="Total Accounts" />,
    contentLeftTitle: "Total Accounts",
    contentLeftDescription: "Low impact",
    contentRightTitle: totalAccounts?.toString(),
    contentRightDescription:
      creditMix?.rating.replaceAll("_", " ").toLowerCase() ?? "NA",
    contentRightDescriptionFontColor:
      creditMix && getColorByCreditMetricRating(creditMix?.rating),
    onClick: creditMix && onClick,
  };
}
