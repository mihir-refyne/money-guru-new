import { useMemo, useState } from "react";
import CreditReportLayout from "./CreditReportLayout";
import CreditReportMetricHeader from "./CreditReportMetricHeader";
import creditUsageIllustration from "@/images/credit_usage_illustration.svg";
import CreditReportMetricValue from "./CreditReportMetricValue";
import InfoCard from "../InfoCard";
import { CreditCard, Lightbulb } from "phosphor-react";
import ListCard, { ListCardItemProps } from "../ListCard";
import NoRecordFound from "../NoRecordFound";
import {
  CreditCardAccounts,
  CreditReport,
} from "@/lib/credit-report";
import { formatToInr } from "@/lib/utils";
import { getTagTypeByCreditMetricRating } from "./helpers";
import Modal from "../Modal";
import CreditReportMetricsExplainer, { CreditReportMetricsExplainerProps } from "./CreditReportMetricsExplainer";
import CreditUtilisationExplainer from "../../../data/credit_utilisation_explainer.json"
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import useTranslation from "@/hooks/useTranslation";

interface CreditReportCreditUtilisationProps {
  creditReport: CreditReport;
  onRatingTagClick?: (rating?: string) => void;
}

export default function CreditReportCreditUtilisation({
  creditReport,
  onRatingTagClick,
}: CreditReportCreditUtilisationProps) {
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

  const {
    totalCreditLimit,
    totalCreditUsed,
    totalCreditUsageInPercent,
    rating,
  } = creditReport.metrics.creditUsage;
  const { creditCardAccounts } = creditReport.retailAccountsInfo;

  function handleExplainerOpen() {
    onRatingTagClick?.(rating);
    setIsExplainerActive(true);
  }

  const listCardPropsForActiveAccounts = useMemo<ListCardItemProps[]>(() => {
    const listCardPropsForActiveCreditCardAccounts = creditCardAccounts
      .filter((account) => account.active)
      .map(getCreditUtilisationListCardPropsFromAccount);
    return listCardPropsForActiveCreditCardAccounts;
  }, [creditCardAccounts]);

  return (
    <CreditReportLayout navbarText={t("credit_utilisation_label")}>
      <CreditReportMetricHeader illustrationUrl={creditUsageIllustration.src}>
        {t("credit_usage_info")}
      </CreditReportMetricHeader>
      <CreditReportMetricValue
        title={t("credit_utilisation_label")}
        text={`${formatToInr(totalCreditUsed)} / ${formatToInr(
          totalCreditLimit
        )}`}
        subText={totalCreditUsageInPercent}
        infoTag={{
          type: getTagTypeByCreditMetricRating(rating),
          value: rating.replaceAll("_", " ").toLowerCase(),
        }}
        onInfoTagClick={handleExplainerOpen}
      />
      <InfoCard
        icon={<Lightbulb size={20} color="var(--clr-info-highlight-default)" />}
      >
        {t("credit_usage_advice")}
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
          {...(CreditUtilisationExplainer as CreditReportMetricsExplainerProps)}
          ctaLabel={t("got_it_btn")}
          onCtaClick={() => handleExplainerClose(true)}
        />
      </Modal>
    </CreditReportLayout>
  );
}

function getCreditUtilisationListCardPropsFromAccount(
  accounts: CreditCardAccounts
): ListCardItemProps {
  const { institution, accountType, creditUsageInPercent } =
    accounts;

  return {
    leftIcon: <CreditCard size={32} color="var(--clr-brand-default)" />,
    contentLeftTitle: institution,
    contentLeftDescription: accountType,
    contentRightTitle: creditUsageInPercent,
  };
}
