import { useMemo, useState } from "react";
import CreditReportLayout from "./CreditReportLayout";
import CreditReportMetricHeader from "./CreditReportMetricHeader";
import creditEnquiriesIllustration from "@/images/credit_enquiries_illustration.svg";
import CreditReportMetricValue from "./CreditReportMetricValue";
import InfoCard from "../InfoCard";
import { CreditCard, Lightbulb } from "phosphor-react";
import ListCard, { ListCardItemProps } from "../ListCard";
import CreditReportAccountNotFound from "./CreditReportAccountNotFound";
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

interface CreditReportCreditEnquiriesProps {
  creditReport: CreditReport;
  onRatingTagClick?: (rating?: string) => void;
}

export default function CreditReportCreditEnquiries({
  creditReport,
  onRatingTagClick,
}: CreditReportCreditEnquiriesProps) {
  const [isExplainerActive, setIsExplainerActive] = useState<boolean>(false);

  function handleExplainerClose(isCtaClick: boolean = false) {
    logEventInMixpanel(AnalyticEvent.CREDIT_SCORE_RATING_TAG_INFO_POPUP_CTA_CLICKED, {
      cta_type: isCtaClick ? "GOT_IT" : "CLOSE"
    })
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
    <CreditReportLayout navbarText="Enquiries">
      <CreditReportMetricHeader
        illustrationUrl={creditEnquiriesIllustration.src}
      >
        An enquiry occurs when a lending institution checks your credit report
        when you&apos;ve applied for a credit product (loans, credit cards, etc.)
      </CreditReportMetricHeader>
      <CreditReportMetricValue
        title="Enquiries"
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
        If you apply for multiple credit products in a short time, your
        enquiries increase. It shows that you heavily rely on credit. Lending
        institutions may assume you are a risky borrower
      </InfoCard>
      {listCardPropsForActiveAccounts.length > 0 ? (
        <ListCard className="mt-4" items={listCardPropsForActiveAccounts} />
      ) : (
        <CreditReportAccountNotFound />
      )}
      <Modal
        active={isExplainerActive}
        bottomSheetOnMobile
        onClose={handleExplainerClose}
      >
        <CreditReportMetricsExplainer
          {...(CreditEnquiriesExplainerData as CreditReportMetricsExplainerProps)}
          ctaLabel="Got it"
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
