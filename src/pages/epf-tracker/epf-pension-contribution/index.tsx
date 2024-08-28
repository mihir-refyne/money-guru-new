import EpfHowToWithdrawalSummaryCard from "@/components/EpfTracker/EpfHowToWithdrawalSummaryCard";
import { HowToWithdrawPfSummaryType } from "@/components/EpfTracker/constants";

const EPF_PENSION_CONTRIBUTION: HowToWithdrawPfSummaryType[] = [
  {
    heading: "pension_benefits_header",
    summarySteps: [
      {
        label: "pension_calculation_label",
        desc: "pension_calculation_desc",
        hideIcon: true,
      },
      {
        label: "monthly_pension_label",
        desc: "monthly_pension_desc",
        hideIcon: true,
      },
    ],
  },
  {
    heading: "family_support_header",
    summarySteps: [
      {
        label: "family_pension_label",
        desc: "family_pension_desc",
        hideIcon: true,
      },
      {
        label: "lump_sum_label",
        desc: "lump_sum_desc",
        hideIcon: true,
      },
    ],
  },
  {
    heading: "withdrawal_benefits_header",
    summarySteps: [
      {
        label: "early_exit_label",
        desc: "early_exit_desc",
        hideIcon: true,
      },
    ],
  },
];

export default function EpfPensionContribution() {
  return <EpfHowToWithdrawalSummaryCard summary={EPF_PENSION_CONTRIBUTION} />;
}
