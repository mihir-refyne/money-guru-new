import { useMemo, useState } from "react";
import CreditReportLayout from "./CreditReportLayout";
import CreditReportMetricHeader from "./CreditReportMetricHeader";
import creditEnquiriesIllustration from "@/images/credit_enquiries_illustration.svg";
import CreditReportMetricValue from "./CreditReportMetricValue";
import InfoCard from "../InfoCard";
import { CreditCard, Lightbulb } from "phosphor-react";
import ListCard, { ListCardItemProps } from "../ListCard";
import NoRecordFound from "../NoRecordFound";
import { CreditReport, Enquiry } from "@/lib/credit-report";
import { getTagTypeByCreditMetricRating } from "./helpers";
import Modal from "../Modal";
import CreditReportMetricsExplainer, {
  CreditReportMetricsExplainerProps,
} from "./CreditReportMetricsExplainer";
import CreditEnquiriesExplainerData from "../../../data/new_enquiries_explainer.json";
import format from "date-fns/format"
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import useTranslation from "@/hooks/useTranslation";

interface CreditReportCreditEnquiriesProps {
  creditReport: CreditReport;
  onRatingTagClick?: (rating?: string) => void;
}

export default function CreditReportCreditEnquiries({
  creditReport,
  onRatingTagClick,
}: CreditReportCreditEnquiriesProps) {
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

  const { totalEnquiries, rating } = creditReport.metrics.enquiries;

  function handleExplainerOpen() {
    onRatingTagClick?.(rating);
    setIsExplainerActive(true);
  }

  const listCardPropsForActiveAccounts = useMemo<ListCardItemProps[]>(() => {
    return creditReport.enquiries.map(
      getCreditEnquiriesListCardPropsFromAccount
    );
  }, [creditReport.enquiries]);

  return (
    <CreditReportLayout navbarText={t("enquiries_label")}>
      <CreditReportMetricHeader
        illustrationUrl={creditEnquiriesIllustration.src}
      >
        {t("enquiry_definition")}
      </CreditReportMetricHeader>
      <CreditReportMetricValue
        title={t("enquiries_label")}
        text={totalEnquiries.toString()}
        infoTag={{
          type: getTagTypeByCreditMetricRating(rating),
          value: rating.replaceAll("_", " ").toLowerCase(),
        }}
        onInfoTagClick={handleExplainerOpen}
      />
      <InfoCard
        icon={<Lightbulb size={20} color="var(--clr-info-highlight-default)" />}
      >
        {t("multiple_enquiries_impact")}
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
          {...(CreditEnquiriesExplainerData as CreditReportMetricsExplainerProps)}
          ctaLabel={t("got_it_btn")}
          onCtaClick={() => handleExplainerClose(true)}
        />
      </Modal>
    </CreditReportLayout>
  );
}

function getCreditEnquiriesListCardPropsFromAccount(
  enquiries: Enquiry
): ListCardItemProps {
  const { institution, purpose, date } = enquiries;
  return {
    leftIcon: <CreditCard size={32} color="var(--clr-brand-default)" />,
    contentLeftTitle: institution,
    contentLeftDescription: purpose,
    contentRightTitle: format(new Date(date), "MMMM yyyy"),
  };
}
