import { ArrowsClockwise, CaretRight } from "phosphor-react";
import EpfHowToWithdrawalSummaryCard from "@/components/EpfTracker/EpfHowToWithdrawalSummaryCard";
import { HowToWithdrawPfSummaryType } from "@/components/EpfTracker/constants";

const EPF_HOW_TO_WITHDRAWAL_SUMMARY: HowToWithdrawPfSummaryType[] = [
  {
    heading: "How to raise a claim on EPFO portal",
    summarySteps: [
      {
        label: "Login & Verify",
        desc: "Login to EPFO portal. Ensure your KYC details are verified",
        hasBottomBorder: true,
      },
      {
        label: "Raise a claim application",
        desc: `Select 'Online Services', and select Claim (Form-31,19,10C&10D)`,
        hasBottomBorder: true,
      },
      {
        label: "Specify claim reason",
        desc: "PF withdrawals are permitted under certain conditions and for specific purposes",
        descFooterText: "Permitted claim reasons",
        descFooterIcon: <CaretRight color="#0057B7" />,
        hasBottomBorder: true,
        hasDescFooter: true,
      },
      {
        label: "Submission",
        desc: "Approval from the employer is required and the amount will be credited to your bank account within 15-20 days",
      },
    ],
  },
  {
    heading: "Withdrawing early from EPF is not adivsed",
    summarySteps: [
      {
        icon: <ArrowsClockwise />,
        iconBackgroundColor: "#FFF3E8",
        label: "Reduced Retirement Corpus",
        desc: "Withdrawing funds lower your retirement savings, risking insufficient funds in retirement.",
        hasBottomBorder: true,
      },
      {
        icon: <ArrowsClockwise />,
        iconBackgroundColor: "#FFF3E8",
        label: "Loss of Compunding Benefits",
        desc: "Early withdrawal stops compounding interest, reducing potential earnings and growth.",
        hasBottomBorder: true,
      },
      {
        icon: <ArrowsClockwise />,
        iconBackgroundColor: "#FFF3E8",
        label: "Tax Implications for Early Withdrawal",
        desc: "Withdrawals before five years incur TDS, decreasing the amount received.",
      },
    ],
  },
];

export default function EpfHowToWithdrawalSummary() {
  return (
    <EpfHowToWithdrawalSummaryCard summary={EPF_HOW_TO_WITHDRAWAL_SUMMARY} />
  );
}
