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
import NoRecordFound from "../NoRecordFound";
import { getTagTypeByCreditMetricRating } from "./helpers";
import Modal from "../Modal";
import CreditReportMetricsExplainer, { CreditReportMetricsExplainerProps } from "./CreditReportMetricsExplainer";
import PaymentHistoryExplainerData from "../../../data/payment_history_explainer.json"
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import useTranslation from "@/hooks/useTranslation";

interface CreditReportPaymentHistoryProps {
  creditReport: CreditReport;
  onRatingTagClick?: (rating?: string) => void;
}

export default function CreditReportPaymentHistory({
  creditReport,
  onRatingTagClick,
}: CreditReportPaymentHistoryProps) {
  const { t } = useTranslation("common");
  const [isExplainerActive, setIsExplainerActive] = useState<boolean>(false);

  const { onTimePayments, totalPayments, onTimePaymentPercentage, rating } =
    creditReport.metrics.paymentHistory;
  const { loanAccounts, creditCardAccounts } = creditReport.retailAccountsInfo;

  function handleExplainerOpen() {
    onRatingTagClick?.(rating);
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
    <CreditReportLayout navbarText={t("payment_history_label")}>
      <CreditReportMetricHeader
        illustrationUrl={paymentHistoryIllustration.src}
      >
        {t("payment_history_importance")}
      </CreditReportMetricHeader>
      <CreditReportMetricValue
        title={t("payment_on_time")}
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
        {t("credit_card_bill_advice")}
      </InfoCard>
      {listCardPropsForActiveAccounts.length > 0 ? (
        <ListCard className="mt-4" items={listCardPropsForActiveAccounts} />
      ) : (
        <NoRecordFound
          title={t("no_payment_history")}
          description={t("space_for_updates")}
        />
      )}
      <Modal
        active={isExplainerActive}
        bottomSheetOnMobile
        onClose={handleExplainerClose}
      >
        <CreditReportMetricsExplainer
          {...(PaymentHistoryExplainerData as CreditReportMetricsExplainerProps)}
          ctaLabel={t("got_it_btn")}
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
