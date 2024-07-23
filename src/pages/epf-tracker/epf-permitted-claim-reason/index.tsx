import { PermittedClaimReasonType } from "@/components/EpfTracker/constants";
import EpfHowToWithdrawalSummaryCard from "@/components/EpfTracker/EpfHowToWithdrawalSummaryCard";

const PERMITTED_CLAIM_REASONS: PermittedClaimReasonType[] = [
  {
    heading: "full_withdrawal_heading",
    summarySteps: [
      {
        label: "retirement_label",
        desc: "retirement_desc",
        hasBottomBorder: false,
        hideIcon: true,
      },
      {
        label: "unemployment_label",
        desc: "unemployment_desc",
        hideIcon: true,
      },
    ],
  },
  {
    heading: "partial_withdrawal_heading",
    summarySteps: [
      {
        label: "unemployment_label",
        desc: "unemployment_desc",
        hasBottomBorder: false,
        hideIcon: true,
      },
      {
        label: "medical_emergencies_label",
        desc: "medical_emergencies_desc",
        hasBottomBorder: false,
        hideIcon: true,
      },
      {
        label: "higher_education_label",
        desc: "higher_education_desc",
        hasBottomBorder: false,
        hideIcon: true,
      },
      {
        label: "home_purchase_label",
        desc: "home_purchase_desc",
        hasBottomBorder: false,
        hideIcon: true,
      },
      {
        label: "home_loan_label",
        desc: "home_loan_desc",
        hasBottomBorder: false,
        hideIcon: true,
      },
      {
        label: "house_renovation_label",
        desc: "house_renovation_desc",
        hasBottomBorder: false,
        hideIcon: true,
      },
      {
        label: "preretirement_label",
        desc: "preretirement_desc",
        hasBottomBorder: false,
        hideIcon: true,
      },
    ],
  },
];

export default function EpfPermittedClaimReason() {
  return <EpfHowToWithdrawalSummaryCard summary={PERMITTED_CLAIM_REASONS} />;
}
