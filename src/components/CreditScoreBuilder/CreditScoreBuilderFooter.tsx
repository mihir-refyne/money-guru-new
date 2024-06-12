import useTranslation from "@/hooks/useTranslation";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { UserStatus } from "@/lib/core/user";
import CommonFooter from "../CreditReport/CreditReportLayout/CommonFooter";
import { CreditScoreBuilderProgress } from "./CreditScoreProgressSection";

type CreditScoreBuilderFooterProps = {
  userStatus: UserStatus;
  currentUserProgress?: CreditScoreBuilderProgress;
  onWithdraw: () => void;
  onCompleteKyc: () => void;
  onIncompleteKyc: () => void;
  onViewReport: () => void;
  onVerificationPending: () => void;
};

export default function CreditScoreBuilderFooter({
  userStatus,
  currentUserProgress = CreditScoreBuilderProgress.WITHDRAWAL_PENDING,
  onCompleteKyc,
  onIncompleteKyc,
  onViewReport,
  onWithdraw,
  onVerificationPending,
}: CreditScoreBuilderFooterProps) {
  const footerData = getFooterDataByStatus(userStatus, currentUserProgress);

  const { tWithoutTypeSafety } = useTranslation("common");

  if (!footerData) {
    return null;
  }

  function handlerCtaClick() {
    if (footerData?.actionType === "KYC_VERIFICATION_PENDING") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "PRIMARY",
          cta: "VERIFICATION_PENDING",
        }
      );
      return onVerificationPending();
    }
    if (footerData?.actionType === "KYC_INCOMPLETE") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "PRIMARY",
          cta: "INCOMPLETE_KYC",
        }
      );
      return onIncompleteKyc();
    }
    if (footerData?.actionType === "KYC_PENDING") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "PRIMARY",
          cta: "COMPLETE_KYC",
        }
      );
      return onCompleteKyc();
    }
    if (footerData?.actionType === "VIEW_REPORT") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "PRIMARY",
          cta: "CREDIT_SCORE",
        }
      );
      return onViewReport();
    }
    if (footerData?.actionType === "WITHDRAW") {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
        {
          source: "PRIMARY",
          cta: "WITHDRAW",
        }
      );
      return onWithdraw();
    }
  }
  return (
    <div className="p-4">
      <button onClick={handlerCtaClick} className="btn btn-primary btn-block">
        {tWithoutTypeSafety(footerData?.text ?? "")}
      </button>
      <CommonFooter />
    </div>
  );
}

type FooterAction =
  | "KYC_PENDING"
  | "KYC_INCOMPLETE"
  | "KYC_VERIFICATION_PENDING"
  | "WITHDRAW"
  | "VIEW_REPORT";

function getFooterDataByStatus(
  userStatus: string,
  userProgress: CreditScoreBuilderProgress
): {
  text: string;
  actionType: FooterAction;
} | null {
  if (
    userStatus === UserStatus.VERIFICATION_PENDING ||
    userStatus === UserStatus.USER_MODIFIED_VERIFICATION_PENDING
  ) {
    return {
      text: "credit_score_builder_cta_verify_pending",
      actionType: "KYC_VERIFICATION_PENDING",
    };
  }
  if (
    userStatus === UserStatus.INCOMPLETE_INFO ||
    userStatus === UserStatus.USER_MODIFIED_INCORRECT_INFO
  ) {
    return {
      text: "credit_score_builder_cta_pre_kyc",
      actionType: "KYC_INCOMPLETE",
    };
  }
  if (
    userStatus === UserStatus.INITIATED ||
    userStatus === UserStatus.SALARY_VIEWABLE
  ) {
    return {
      text: "credit_score_builder_cta_pre_kyc",
      actionType: "KYC_PENDING",
    };
  }
  if (
    userStatus === UserStatus.REFYNE_VERIFIED &&
    userProgress === CreditScoreBuilderProgress.WITHDRAWAL_PENDING
  ) {
    return {
      text: "credit_score_builder_cta_withdraw",
      actionType: "WITHDRAW",
    };
  }
  if (
    userStatus === UserStatus.REFYNE_VERIFIED &&
    userProgress === CreditScoreBuilderProgress.CREDIT_REPORT_GENERATED
  ) {
    return {
      text: "credit_score_builder_cta_view_report",
      actionType: "VIEW_REPORT",
    };
  }
  return null;
}
