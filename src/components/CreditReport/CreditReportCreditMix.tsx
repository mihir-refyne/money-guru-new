import { useMemo, useState } from "react";
import CreditReportLayout from "./CreditReportLayout";
import CreditReportMetricHeader from "./CreditReportMetricHeader";
import creditMixIllustration from "@/images/credit_mix_illustration.svg";
import CreditReportMetricValue from "./CreditReportMetricValue";
import InfoCard from "../InfoCard";
import { CreditCard, FileText, Lightbulb } from "phosphor-react";
import ListCard, { ListCardItemProps } from "../ListCard";
import NoRecordFound from "../NoRecordFound";
import {
  CreditCardAccounts,
  CreditReport,
  LoanAccounts,
} from "@/lib/credit-report";
import { getTagTypeByCreditMetricRating } from "./helpers";
import Modal from "../Modal";
import CreditReportMetricsExplainer, {
  CreditReportMetricsExplainerProps,
} from "./CreditReportMetricsExplainer";
import CreditMixExplainer from "../../../data/credit_mix_explainer.json";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import useTranslation from "@/hooks/useTranslation";

interface CreditReportCreditMixProps {
  creditReport: CreditReport;
  onRatingTagClick?: (rating: string) => void;
}

export default function CreditReportCreditMix({
  creditReport,
  onRatingTagClick,
}: CreditReportCreditMixProps) {
  const { t } = useTranslation("common");
  const [isExplainerActive, setIsExplainerActive] = useState<boolean>(false);

  function handleExplainerClose(isCtaClick: boolean = false) {
    logEventInMixpanel(
      AnalyticEvent.CREDIT_SCORE_RATING_TAG_INFO_POPUP_CTA_CLICKED,
      {
        cta_type: isCtaClick ? "GOT_IT" : "CLOSE",
      }
    );
    setIsExplainerActive(false);
  }

  const { totalActiveCreditCards, totalActiveLoans, rating } =
    creditReport.metrics.creditMix;
  const { loanAccounts, creditCardAccounts } = creditReport.retailAccountsInfo;

  function handleExplainerOpen() {
    onRatingTagClick?.(rating);
    setIsExplainerActive(true);
  }

  const listCardPropsForActiveAccounts = useMemo<ListCardItemProps[]>(() => {
    const listCardPropsForActiveLoanAccounts = loanAccounts
      .filter((account) => account.active)
      .map(getCreditMixListCardPropsFromAccount);
    const listCardPropsForActiveCreditCardAccounts = creditCardAccounts
      .filter((account) => account.active)
      .map(getCreditMixListCardPropsFromAccount);
    return listCardPropsForActiveLoanAccounts.concat(
      listCardPropsForActiveCreditCardAccounts
    );
  }, [loanAccounts, creditCardAccounts]);

  return (
    <CreditReportLayout navbarText={t("credit_mix_label")}>
      <CreditReportMetricHeader illustrationUrl={creditMixIllustration.src}>
        {t("credit_mix_info")}
      </CreditReportMetricHeader>
      <CreditReportMetricValue
        title={t("credit_mix_label")}
        text={`${totalActiveCreditCards} Credit Cards, ${totalActiveLoans} Loans`}
        infoTag={{
          type: getTagTypeByCreditMetricRating(rating),
          value: rating.replaceAll("_", " ").toLowerCase(),
        }}
        onInfoTagClick={handleExplainerOpen}
      />
      <InfoCard
        icon={<Lightbulb size={20} color="var(--clr-info-highlight-default)" />}
      >
        {t("diverse_credit_advice")}
      </InfoCard>
      {listCardPropsForActiveAccounts.length > 0 ? (
        <ListCard className="mt-4" items={listCardPropsForActiveAccounts} />
      ) : (
        <NoRecordFound />
      )}
      <Modal
        active={isExplainerActive}
        bottomSheetOnMobile
        onClose={handleExplainerClose}
      >
        <CreditReportMetricsExplainer
          {...(CreditMixExplainer as CreditReportMetricsExplainerProps)}
          ctaLabel={t("got_it_btn")}
          onCtaClick={() => handleExplainerClose(true)}
        />
      </Modal>
    </CreditReportLayout>
  );
}

function getCreditMixListCardPropsFromAccount(
  accounts: CreditCardAccounts | LoanAccounts
): ListCardItemProps {
  const { institution, accountType, loanType } = accounts;
  const Icon = accountType === "Credit Card" ? CreditCard : FileText;
  return {
    leftIcon: <Icon size={32} color="var(--clr-brand-default)" />,
    contentLeftTitle: institution,
    contentLeftDescription: accountType,
    contentRightDescription: loanType,
    contentRightDescriptionFontColor:
      loanType !== "unsecured"
        ? "var(--clr-info-success-default)"
        : "var(--clr-text-secondary)",
  };
}
