export type LoanProductType = 'EDUCATION' | 'HOME';

export interface BenefitItem {
  icon: string;
  title: string;
  id: string;
}

export interface LoanProductConfig {
  title: string;
  subtitle: string;
  heroImage: string;
  interestRate: string;
  benefits: BenefitItem[];
  ctaText: string;
  footerText: string;
}
