import { useMemo, useState } from "react";
import CreditReportLayout from "./CreditReportLayout";
import CreditReportMetricHeader from "./CreditReportMetricHeader";
import paymentHistoryIllustration from "@/images/payment_history_illustration.svg";
import CreditReportMetricValue from "./CreditReportMetricValue";
import InfoCard from "../InfoCard";
import { CreditCard, FileText, Lightbulb } from "phosphor-react";
import ListCard, { ListCardItemProps } from "../ListCard";
import {
  CreditCardAccounts,
  CreditReport,
  LoanAccounts,
} from "@/lib/credit-report";
import CreditReportAccountNotFound from "./CreditReportAccountNotFound";
import { getTagTypeByCreditMetricRating } from "./helpers";
import Modal from "../Modal";
import CreditReportMetricsExplainer, { CreditReportMetricsExplainerProps } from "./CreditReportMetricsExplainer";
import PaymentHistoryExplainerData from "../../../data/payment_history_explainer.json"
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

interface CreditReportPaymentHistoryProps {
  creditReport: CreditReport;
  onRatingTagClick?: (rating?: string) => void;
}

export default function CreditReportPaymentHistory({
  creditReport,
  onRatingTagClick,
}: CreditReportPaymentHistoryProps) {
  const [isExplainerActive, setIsExplainerActive] = useState<boolean>(false);

  const { onTimePayments, totalPayments, onTimePaymentPercentage, rating } =
    creditReport.metrics.paymentHistory;
  const { loanAccounts, creditCardAccounts } = creditReport.retailAccountsInfo;

  function handleExplainerOpen() {
    onRatingTagClick?.(rating);
    setIsExplainerActive(true);
  }
  function handleExplainerClose(isCtaClick: boolean = false) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_RATING_TAG_INFO_POPUP_CTA_CLICKED, {
      cta_type: isCtaClick ? "GOT_IT" : "CLOSE"
    })
    setIsExplainerActive(false);
  }

  const listCardPropsForActiveAccounts = useMemo<ListCardItemProps[]>(() => {
    const listCardPropsForActiveLoanAccounts = loanAccounts
      .filter((account) => account.active)
      .map(getPaymentHistoryListCardPropsFromAccount);
    const listCardPropsForActiveCreditCardAccounts = creditCardAccounts
      .filter((account) => account.active)
      .map(getPaymentHistoryListCardPropsFromAccount);
    return listCardPropsForActiveLoanAccounts.concat(
      listCardPropsForActiveCreditCardAccounts
    );
  }, [loanAccounts, creditCardAccounts]);

  return (
    <CreditReportLayout navbarText="Payment History">
      <CreditReportMetricHeader
        illustrationUrl={paymentHistoryIllustration.src}
      >
        Paying on time impacts your CREDIT Score the most and shows how reliable
        you are as a borrower.
      </CreditReportMetricHeader>
      <CreditReportMetricValue
        title="Payments on time"
        text={`${onTimePayments} / ${totalPayments}`}
        subText={onTimePaymentPercentage}
        infoTag={{
          type: getTagTypeByCreditMetricRating(rating),
          value: rating.replaceAll("_", " ").toLowerCase(),
        }}
        onInfoTagClick={handleExplainerOpen}
      />
      <InfoCard
        icon={<Lightbulb size={20} color="var(--clr-info-highlight-default)" />}
      >
        You should always pay the full credit card bill and EMI by the due date.
      </InfoCard>
      {listCardPropsForActiveAccounts.length > 0 ? (
        <ListCard className="mt-4" items={listCardPropsForActiveAccounts} />
      ) : (
        <CreditReportAccountNotFound
          title="No available payment history"
          description="Check this space for further updates"
        />
      )}
      <Modal
        active={isExplainerActive}
        bottomSheetOnMobile
        onClose={handleExplainerClose}
      >
        <CreditReportMetricsExplainer
          {...(PaymentHistoryExplainerData as CreditReportMetricsExplainerProps)}
          ctaLabel="Got it"
          onCtaClick={() => handleExplainerClose(true)}
        />
      </Modal>
    </CreditReportLayout>
  );
}

function getPaymentHistoryListCardPropsFromAccount(
  accounts: CreditCardAccounts | LoanAccounts
): ListCardItemProps {
  const { institution, accountType, totalPayments, totalOnTimePayments } =
    accounts;
  const isAllPaymentsOnTime = totalPayments === totalOnTimePayments;
  const Icon = accountType === "Credit Card" ? CreditCard : FileText;
  return {
    leftIcon: <Icon size={32} color="var(--clr-brand-default)" />,
    contentLeftTitle: institution,
    contentLeftDescription: accountType,
    contentRightTitle: `${totalOnTimePayments} / ${totalPayments}`,
    contentRightDescription: isAllPaymentsOnTime ? "On-time" : "Delayed",
    contentRightDescriptionFontColor: isAllPaymentsOnTime
      ? "var(--clr-info-success-default)"
      : "var(--clr-text-secondary)",
  };
}
