import PageLayout from "@/components/PageLayout";
import { CheckCircle } from "phosphor-react";
import { ReactNode } from "react";
import RScoreDetails from "./details/index";

interface ImproveRScoreProps {
  improveRScoreSteps: ImproveRScoreSteps[];
}

export interface ImproveRScoreSteps {
  step: number;
  heading: string;
  description: string;
}

export interface RScoreBenefits {
  icon: ReactNode;
  label: string;
}

const IMPROVE_R_SCORE_STEPS: ImproveRScoreSteps[] = [
  {
    step: 1,
    heading: "Liquidity Score",
    description: "Verify your KYC & video KYC to enhance your Liquidity Score.",
  },
  {
    step: 2,
    heading: "Saving Score",
    description: "Grow your Saving Score by using our Gold Product.",
  },
  {
    step: 3,
    heading: "Safety Score",
    description:
      "Boost your score by using products like Salary Protect and Pocket Insurance.",
  },
  {
    step: 4,
    heading: "Literacy Score",
    description: "Complete Money Guru courses to increase your Literacy Score.",
  },
];

const R_SCORE_BENEFITS: RScoreBenefits[] = [
  {
    icon: <CheckCircle weight="fill" size={16} color="#01752F" />,
    label: "Vehicle Loan",
  },
  {
    icon: <CheckCircle weight="fill" size={16} color="#01752F" />,
    label: "Advance Salary",
  },
  {
    icon: <CheckCircle weight="fill" size={16} color="#01752F" />,
    label: "Refyne Salary Card",
  },
];

export default function RScore() {
  return (
    <PageLayout
      navbarText={"R-score"}
      hasLocalButton={false}
      hasContentPadding={false}
    >
      <RScoreDetails
        improveRScoreSteps={IMPROVE_R_SCORE_STEPS}
        rScoreBenefits={R_SCORE_BENEFITS}
      />
    </PageLayout>
  );
}
