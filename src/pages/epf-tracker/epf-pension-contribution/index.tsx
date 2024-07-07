import EpfHowToWithdrawalSummaryCard from "@/components/EpfTracker/EpfHowToWithdrawalSummaryCard";
import { HowToWithdrawPfSummaryType } from "@/components/EpfTracker/constants";

const EPF_PENSION_CONTRIBUTION: HowToWithdrawPfSummaryType[] = [
  {
    heading: "Pension benefits",
    summarySteps: [
      {
        label: "Pension Calculation",
        desc: "At retirement (age 58), the pension is based on the average salary of the last 12 months and years of service",
      },
      {
        label: "Monthly Pension",
        desc: "The pension is then disbursed monthly to the pensioner for life",
      },
    ],
  },
  {
    heading: "Family Support Benefits",
    summarySteps: [
      {
        label: "Family Pension",
        desc: "On the pensioner’s death, the spouse and eligible children receive a percentage of the pension",
      },
      {
        label: "Lump Sum",
        desc: "If the employee dies before 10 years of service, the corpus is paid as a lump sum to the nominee",
      },
    ],
  },
  {
    heading: "Withdrawal Benefits",
    summarySteps: [
      {
        label: "Early Exit",
        desc: "Leaving the job before age 58 and without 10 years of service allows withdrawal of the pension contribution, calculated based on years of service",
      },
    ],
  },
];

export default function EpfPensionContribution() {
  return <EpfHowToWithdrawalSummaryCard summary={EPF_PENSION_CONTRIBUTION} />;
}
