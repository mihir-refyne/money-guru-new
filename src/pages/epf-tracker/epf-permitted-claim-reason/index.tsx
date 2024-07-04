import { PermittedClaimReasonType } from "@/components/EpfTracker/constants";
import EpfHowToWithdrawalSummaryCard from "@/components/EpfTracker/EpfHowToWithdrawalSummaryCard";

const PERMITTED_CLAIM_REASONS: PermittedClaimReasonType[] = [
  {
    heading: "Full Withdrawal",
    summarySteps: [
      {
        label: "Retirement",
        desc: "You can fully withdraw your EPF balance after retirement.",
        hasBottomBorder: true,
      },
      {
        label: "Unemployment",
        desc: "If you are unemployed for more than tow months, you can withdraw the EPF balance",
      },
    ],
  },
  {
    heading: "Partial Withdrawal",
    summarySteps: [
      {
        label: "Unemployment",
        desc: "If you are unemployed for more than tow months, you can withdraw the EPF balance",
        hasBottomBorder: true,
      },
      {
        label: "Medical Emergencies",
        desc: "Up to 50% of your contribution to EPF can be withdrawn after seven years of service",
        hasBottomBorder: true,
      },
      {
        label: "Higher Education",
        desc: "Up to 50% of your contribution to EPF can be withdrawn after seven years of service",
        hasBottomBorder: true,
      },
      {
        label: "Home Purchase/Construction",
        desc: "Up to 50% of your contribution to EPF can be withdrawn after seven years of service",
        hasBottomBorder: true,
      },
      {
        label: "Home Loan Repayment",
        desc: "Up to 50% of your contribution to EPF can be withdrawn after seven years of service",
        hasBottomBorder: true,
      },
      {
        label: "House Renovation",
        desc: "Up to 50% of your contribution to EPF can be withdrawn after seven years of service",
        hasBottomBorder: true,
      },
      {
        label: "Pre-retirement",
        desc: "Up to 50% of your contribution to EPF can be withdrawn after seven years of service",
      },
    ],
  },
];

export default function EpfPermittedClaimReason() {
  return <EpfHowToWithdrawalSummaryCard summary={PERMITTED_CLAIM_REASONS} />;
}
