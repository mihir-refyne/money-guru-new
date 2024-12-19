import { LoanType } from '../types';
import BenefitCard from './BenefitCard';
import styles from './styles.module.css';

const benefits = {
  home: [
    {
      icon: '/assets/images/dsa-loan-journey/tailored-home-loan-solution.svg',
      title: 'Tailored Home Loan Solution'
    },
    {
      icon: '/assets/images/dsa-loan-journey/quick-approval.svg',
      title: 'Quick Processing and Approval'
    },
    {
      icon: '/assets/images/dsa-loan-journey/seamless-support.svg',
      title: 'Seamless End-to-End Support'
    },
    {
      icon: '/assets/images/dsa-loan-journey/trusted-lending-partners.svg',
      title: 'Trusted Lending Partners'
    }
  ],
  education: [
    {
      icon: '/assets/images/dsa-loan-journey/affordable-education-loan.svg',
      title: 'Affordable Loan Options'
    },
    {
      icon: '/assets/images/dsa-loan-journey/quick-approval.svg',
      title: 'Quick Processing and Approval'
    },
    {
      icon: '/assets/images/dsa-loan-journey/seamless-support.svg',
      title: 'Seamless End-to-End Support'
    },
    {
      icon: '/assets/images/dsa-loan-journey/trusted-lending-partners.svg',
      title: 'Trusted Lending Partners'
    }
  ]
} as const;

interface KeyBenefitsProps {
  loanType: LoanType;
}

export default function KeyBenefits({ loanType }: KeyBenefitsProps) {
  return (
    <div className={styles.container}>
      {benefits[loanType].map((benefit, index) => (
        <BenefitCard
          key={index}
          icon={benefit.icon}
          title={benefit.title}
        />
      ))}
    </div>
  );
}
