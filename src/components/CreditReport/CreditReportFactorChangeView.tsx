import { CreditReportAnalysis } from "@/lib/credit-report";
import CreditScoreDifferenceText from "./CreditScoreDifferenceText";
import useTranslation from "@/hooks/useTranslation";
import ListCard from "../ListCard";
import rupeeReloadIconUrl from "@/images/rupee_reload.svg";
import walletIconUrl from "@/images/wallet.svg";
import moneyBagIconUrl from "@/images/money_bag.svg";
import cardSearchIconUrl from "@/images/card_search.svg";
import Image from "next/image";
import format from "date-fns/format";
import { getLastItemOfArray } from "@/lib/utils";

interface CreditReportFactorChangeViewProps {
  creditReportAnalysis?: CreditReportAnalysis;
  onPrimaryCtaClick?: () => void;
}

export default function CreditReportFactorChangeView({
  creditReportAnalysis,
  onPrimaryCtaClick,
}: CreditReportFactorChangeViewProps) {
  const { t } = useTranslation("common");
  if (!creditReportAnalysis) return null;
  const currentMonthScoreDifference =
    getLastItemOfArray(creditReportAnalysis?.creditScoresAnalysis ?? [])
      ?.differenceFromLastFetchedScore ?? null;
  const {
    comparisionPeriod,
    creditAccounts,
    creditEnquiries,
    creditUsage,
    paymentHistory,
  } = creditReportAnalysis.metricsAnalysis;
  if (!comparisionPeriod?.fromDate || currentMonthScoreDifference === null)
    return null;
  const comparisionPeriodText = `${format(
    new Date(comparisionPeriod.fromDate),
    "MMM"
  )} - ${format(new Date(comparisionPeriod.tillDate), "MMM")} ${format(
    new Date(comparisionPeriod.tillDate),
    "yyyy"
  )}`;

  return (
    <div>
      <h3 className="text-heading text-medium text-center text-uppercase my-2">
        {comparisionPeriodText}
      </h3>
      <CreditScoreDifferenceText className="mb-6">
        {currentMonthScoreDifference}
      </CreditScoreDifferenceText>
      <div className="mb-6">
        <PaymentHistoryChange paymentHistory={paymentHistory} />
        <CreditUtilisationChange creditUsage={creditUsage} />
        <CreditEnquiriesChange creditEnquiries={creditEnquiries} />
        <AccountsChange creditAccounts={creditAccounts} />
      </div>
      <button className="btn btn-block btn-primary" onClick={onPrimaryCtaClick}>
        {t("credit_report_factor_change_modal_cta")}
      </button>
    </div>
  );
}

function ChangeDescription(props: {
  explanationHtml: string;
  hint?: string;
  showHint?: boolean;
}) {
  const { explanationHtml, hint, showHint = false } = props;
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: explanationHtml }} />
      {showHint && hint && (
        <>
          <br />
          <span>{hint}</span>
        </>
      )}
    </>
  );
}

const THRESHOLD_VALUE_TO_SHOW_HINT_FOR_PAYMENT_HISTORY = 0;
const THRESHOLD_VALUE_TO_SHOW_HINT_FOR_CREDIT_USAGE = 30;
const THRESHOLD_VALUE_TO_SHOW_HINT_FOR_CREDIT_ENQUIRIES = 9;

function PaymentHistoryChange(props: {
  paymentHistory: CreditReportAnalysis["metricsAnalysis"]["paymentHistory"];
}) {
  const { paymentHistory } = props;
  const { t } = useTranslation("common");
  if (!paymentHistory) return null;
  const { differenceInLatePaymentsFromLastFetched } = paymentHistory;
  if (!differenceInLatePaymentsFromLastFetched) return null;
  const explanationHtml =
    differenceInLatePaymentsFromLastFetched > 0
      ? t("credit_report_factor_diff_missed_payment", {
          missedPaymentsCount: differenceInLatePaymentsFromLastFetched,
        })
      : t("credit_report_factor_diff_payment_on_time");
  const showHint =
    differenceInLatePaymentsFromLastFetched >
    THRESHOLD_VALUE_TO_SHOW_HINT_FOR_PAYMENT_HISTORY;
  return (
    <ListCard
      className="mb-4"
      items={[
        {
          leftIcon: <Image src={rupeeReloadIconUrl} alt="Payment History" />,
          contentLeftTitle: t("payment_history_label"),
          contentLeftDescription: (
            <ChangeDescription
              explanationHtml={explanationHtml}
              showHint={showHint}
              hint={t("credit_report_factor_diff_missed_payment_suggestion")}
            />
          ),
        },
      ]}
    />
  );
}

function CreditUtilisationChange(props: {
  creditUsage: CreditReportAnalysis["metricsAnalysis"]["creditUsage"];
}) {
  const { creditUsage } = props;
  const { t } = useTranslation("common");
  if (!creditUsage) return null;
  const { differenceInCreditUsageFromLastFetched, totalCreditUsageInPercent } =
    creditUsage;
  if (!differenceInCreditUsageFromLastFetched) return null;
  const explanationHtml =
    differenceInCreditUsageFromLastFetched > 0
      ? t("credit_report_factor_diff_credit_usage_incr", {
          creditUsedInPercent: totalCreditUsageInPercent,
          creditUseIncreasedInPercent: differenceInCreditUsageFromLastFetched,
        })
      : t("credit_report_factor_diff_credit_usage_decr", {
          creditUsedInPercent: totalCreditUsageInPercent,
          creditUseDecreasedInPercent: Math.abs(
            differenceInCreditUsageFromLastFetched
          ),
        });
  const showHint =
    differenceInCreditUsageFromLastFetched >
    THRESHOLD_VALUE_TO_SHOW_HINT_FOR_CREDIT_USAGE;

  return (
    <ListCard
      className="mb-4"
      items={[
        {
          leftIcon: <Image src={walletIconUrl} alt="Credit Utilisation" />,
          contentLeftTitle: t("credit_utilisation_label"),
          contentLeftDescription: (
            <ChangeDescription
              explanationHtml={explanationHtml}
              showHint={showHint}
              hint={t("credit_report_factor_diff_credit_usage_suggestion")}
            />
          ),
        },
      ]}
    />
  );
}

function CreditEnquiriesChange(props: {
  creditEnquiries: CreditReportAnalysis["metricsAnalysis"]["creditEnquiries"];
}) {
  const { creditEnquiries } = props;
  const { t } = useTranslation("common");
  if (!creditEnquiries) return null;
  const { differenceInCreditEnquiriesFromLastFetched } = creditEnquiries;
  // TODO: Check do we need to handle "differenceInCreditEnquiriesFromLastFetched == 0" case?
  if (
    !differenceInCreditEnquiriesFromLastFetched ||
    differenceInCreditEnquiriesFromLastFetched < 1
  )
    return null;
  const explanationHtml = t("credit_report_factor_diff_credit_enquiries", {
    creditEnquiriesCount: differenceInCreditEnquiriesFromLastFetched,
  });
  const showHint =
    differenceInCreditEnquiriesFromLastFetched >
    THRESHOLD_VALUE_TO_SHOW_HINT_FOR_CREDIT_ENQUIRIES;
  return (
    <ListCard
      className="mb-4"
      items={[
        {
          leftIcon: <Image src={cardSearchIconUrl} alt="Credit Enquiries" />,
          contentLeftTitle: t("credit_enquiries_label"),
          contentLeftDescription: (
            <ChangeDescription
              explanationHtml={explanationHtml}
              showHint={showHint}
              hint={t("credit_report_factor_diff_credit_enquiries_suggestion")}
            />
          ),
        },
      ]}
    />
  );
}

function AccountsChange(props: {
  creditAccounts: CreditReportAnalysis["metricsAnalysis"]["creditAccounts"];
}) {
  const { creditAccounts } = props;
  const { t } = useTranslation("common");
  if (!creditAccounts) return null;
  const { differenceInNewAccountsAddedFromLastFetched } = creditAccounts;
  // TODO: Check do we need to handle "differenceInNewAccountsAddedFromLastFetched == 0" case?
  if (
    !differenceInNewAccountsAddedFromLastFetched ||
    differenceInNewAccountsAddedFromLastFetched < 1
  )
    return null;
  const explanationHtml = t("credit_report_factor_diff_credit_accounts", {
    creditAccountsCount: differenceInNewAccountsAddedFromLastFetched,
  });
  return (
    <ListCard
      className="mb-4"
      items={[
        {
          leftIcon: <Image src={moneyBagIconUrl} alt="Total Accounts" />,
          contentLeftTitle: t("credit_report_new_accounts"),
          contentLeftDescription: (
            <ChangeDescription explanationHtml={explanationHtml} />
          ),
        },
      ]}
    />
  );
}
