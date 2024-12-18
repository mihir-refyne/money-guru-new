import { useRouter } from 'next/router';
import PageLayout from '@/components/PageLayout';
import AppHeader from '@/components/DsaLoanApplication/AppHeader';
import LoanApplicationForm from '@/components/DsaLoanApplication/LoanApplicationForm';
import { LoanType } from '@/components/DsaLoanApplication/types';
import styles from './styles.module.css';

export default function LoanApplicationFormPage() {
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
        <LoanApplicationForm loanType={loanType} />
      </div>
    </PageLayout>
  );
}
