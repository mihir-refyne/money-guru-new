import { useRouter } from 'next/router';
import PageLayout from '@/components/PageLayout';
import AppHeader from '@/components/DsaLoanApplication/AppHeader';
import HeroSection from '@/components/DsaLoanApplication/HeroSection';
import KeyBenefits from '@/components/DsaLoanApplication/KeyBenefits';
import ProcessSection from '@/components/DsaLoanApplication/ProcessSection';
import Separator from '@/components/DsaLoanApplication/Separator';
import Footer from '@/components/DsaLoanApplication/Footer';
import { LoanType } from '@/components/DsaLoanApplication/types';
import styles from './styles.module.css';

export default function LoanApplicationPage() {
  const router = useRouter();
  const loanType = (router.query.type as LoanType) || 'home';

  return (
    <PageLayout
      hasNavbar={false}
      hasContentPadding={false}
      pageBackground="#F0F7FF"
    >
      <div className={styles.pageContent}>
      <AppHeader />
      <HeroSection loanType={loanType} />
      
      <Separator 
        text="Key Benefits" 
        className={styles.benefitsSeparator}
      />
      
      <KeyBenefits loanType={loanType} />
      
      <Separator 
        text="3 Steps Process" 
        className={styles.processSeparator}
      />
      
      <ProcessSection />
      </div>
      <Footer />
    </PageLayout>
  );
}
