export interface LoanContent {
  title: string;
  subtitle: string;
  imagePath: string;
  interestRate: string;
}

export const loanContent = {
  home: {
    title: 'Your Dream Home is Just a Few Steps Away!',
    subtitle: 'Apply for a home loan with interest rates starting at 8.40% and enjoy exclusive Refyne benefits.',
    imagePath: '/assets/images/dsa-loan-journey/home-loan-hero.svg',
    interestRate: '8.40%'
  },
  education: {
    title: 'Your Dream Education is Just a Few Steps Away!',
    subtitle: 'Apply for an education loan with interest rates starting at 7.90% and enjoy exclusive Refyne benefits.',
    imagePath: '/assets/images/dsa-loan-journey/education-loan.svg',
    interestRate: '7.90%'
  }
} as const;

export type LoanType = keyof typeof loanContent;
