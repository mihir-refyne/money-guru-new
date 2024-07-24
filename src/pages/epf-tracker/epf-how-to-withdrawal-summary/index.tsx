import { CaretRight } from "phosphor-react";
import EpfHowToWithdrawalSummaryCard from "@/components/EpfTracker/EpfHowToWithdrawalSummaryCard";
import { HowToWithdrawPfSummaryType } from "@/components/EpfTracker/constants";

const WALLET_URL = "/assets/images/wallet-warning.svg";
const ARROW_DOWN_URL = "/assets/images/arrow-down.svg";
const PAGE_ERROR_URL = "/assets/images/page-error.svg";

const EPF_HOW_TO_WITHDRAWAL_SUMMARY: HowToWithdrawPfSummaryType[] = [
  {
    heading: "how_to_claim_heading",

    summarySteps: [
      {
        label: "login_and_verify_label",
        desc: "login_and_verify_desc",
      },
      {
        label: "raise_claim_label",
        desc: "raise_claim_desc",
      },
      {
        label: "specify_claim_label",
        desc: "specify_claim_desc",
        descFooterText: "permitted_claim_reasons",
        descFooterIcon: <CaretRight color="#0057B7" />,

        hasDescFooter: true,
      },
      {
        label: "submission",
        desc: "submission_desc",
      },
    ],
  },
  {
    heading: "pf_withdrawal_not_advised",
    summarySteps: [
      {
        imgURL: WALLET_URL,

        iconBackgroundColor: "#FFF3E8",
        label: "reduced_retirement_corpus_label",
        desc: "reduced_retirement_corpus_desc",
        hasBottomBorder: false,
      },
      {
        imgURL: ARROW_DOWN_URL,
        iconBackgroundColor: "#FFF3E8",
        label: "compounding_benefits_loss_label",
        desc: "compounding_benefits_loss_desc",
        hasBottomBorder: false,
      },
      {
        imgURL: PAGE_ERROR_URL,
        iconBackgroundColor: "#FFF3E8",
        label: "tax_exemption_label",
        desc: "tax_exemption_desc",
      },
    ],
  },
];

export default function EpfHowToWithdrawalSummary() {
  return (
    <EpfHowToWithdrawalSummaryCard summary={EPF_HOW_TO_WITHDRAWAL_SUMMARY} />
  );
}
