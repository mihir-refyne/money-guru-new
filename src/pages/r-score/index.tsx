import PageLayout from "@/components/PageLayout";
import { CheckCircle } from "phosphor-react";
import { ReactNode } from "react";
import RScoreDetails from "./details/index";

interface ImproveRScoreProps {
  improveRScoreSteps: ImproveRScoreSteps[];
}

export interface FinancialPillar {
  name: string;
  description: string;
  whyItMatters: string[];
  improvements: {
    action: string;
    redirectionPath: string;
  }[];
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

const FINANCIAL_PILLARS: FinancialPillar[] = [
  {
    name: "Liquidity Score",
    description:
      "Your ability to handle daily expenses and short-term financial needs",
    whyItMatters: [
      "Never miss your children's school fees",
      "Handle medical emergencies with confidence",
      "Celebrate festivals without financial stress",
      "Pay bills on time, every time",
    ],
    improvements: [
      {
        action: "Schedule regular bill payments",
        redirectionPath: "/learning-module/7/chapter/5",
      },
      {
        action: "Build a ₹10,000 emergency fund",
        redirectionPath: "/learning-module/7/chapter/6",
      },
      {
        action: "Optimize your salary withdrawals",
        redirectionPath: "/learning-module/7",
      },
    ],
  },
  {
    name: "Savings Score",
    description:
      "How well you are building long-term wealth and financial security", // Fixed "you'are" to "you are"
    whyItMatters: [
      "Watch your wealth grow month after month",
      "Create a safety net for your family",
      "Plan for big life goals like buying a home", // Fixed "bigh" to "big"
      "Secure your children's future education",
    ],
    improvements: [
      {
        action: "Start small: ₹1000 monthly gold savings",
        redirectionPath: "/learning-module/7/chapter/8",
      },
      {
        action: "Automate your investments",
        redirectionPath: "/learning-module/1",
      },
      {
        action: "Grow your emergency fund",
        redirectionPath: "/learning-module/7/chapter/6",
      },
    ],
  },
  {
    name: "Safety Score",
    description:
      "Your preparedness for financial emergencies and unexpected events",
    whyItMatters: [
      "Protect your family's financial future",
      "Stay confident during job transitions",
      "Handle unexpected expenses smoothly",
      "Keep your income stable during emergencies",
    ],
    improvements: [
      {
        action: "Activate Salary Protect for income security",
        redirectionPath: "/learning-module/7/chapter/7",
      },
      {
        action: "Get pocket insurance for daily peace of mind",
        redirectionPath: "/learning-module/7/chapter/7",
      },
      {
        action: "Complete your emergency fund target",
        redirectionPath: "/learning-module/7/chapter/6",
      },
    ],
  },
  {
    name: "Financial Literacy Score",
    description:
      "Your understanding of key financial concepts and money management",
    whyItMatters: [
      "Make smarter money decisions",
      "Avoid common financial mistakes",
      "Understand investment opportunities better",
      "Plan your taxes efficiently",
    ],
    improvements: [
      {
        action: "Complete Money Basics course",
        redirectionPath: "/learning-module/1",
      },
      {
        action: "Get personalized financial guidance",
        redirectionPath: "/learning-module/1",
      },
      {
        action: "Master financial planning tools",
        redirectionPath: "/learning-module/1",
      },
    ],
  },
];

const IMPROVE_R_SCORE_STEPS: ImproveRScoreSteps[] = [
  {
    step: 1,
    heading: "Complete Your Profile",
    description: "Add your work details and verify your mobile number",
  },
  {
    step: 2,
    heading: "Build Emergency Savings",
    description: "Start small with regular deposits to your emergency fund",
  },
  {
    step: 3,
    heading: "Use Salary Advance Wisely",
    description: "Maintain a good repayment record with timely payments.",
  },
  {
    step: 4,
    heading: "Complete Financial Education",
    description: "Take courses to improve your financial knowledge.",
  },
];

const R_SCORE_BENEFITS: RScoreBenefits[] = [
  {
    icon: <CheckCircle weight="fill" size={16} color="#01752F" />,
    label: "Unlock higher salary advance when you need them",
  },
  {
    icon: <CheckCircle weight="fill" size={16} color="#01752F" />,
    label: "Get better interest rates on financial products.",
  },
  {
    icon: <CheckCircle weight="fill" size={16} color="#01752F" />,
    label: "Access premium financial tools and advisory.",
  },
  {
    icon: <CheckCircle weight="fill" size={16} color="#01752F" />,
    label: "Receive personalised financial recommendations.",
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
        financialPillars={FINANCIAL_PILLARS}
      />
    </PageLayout>
  );
}
