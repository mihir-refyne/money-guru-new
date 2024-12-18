import { useRouter } from 'next/router';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import AppHeader from '@/components/DsaLoanApplication/AppHeader';
import styles from './styles.module.css';

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <PageLayout
      hasNavbar={false}
      hasContentPadding={false}
      pageBackground="#F0F7FF"
    >
      <div className={styles.pageContent}>
        <AppHeader />
        <div className={styles.container}>
          <h1 className={styles.title}>Thank You!</h1>
          <p className={styles.message}>
            We have received your loan application details.
          </p>
          <div className={styles.separator} />
          <p className={styles.message}>
            Our executive will contact you within 24 hours to assist you with your application process.
          </p>
          <button 
            className={styles.button}
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
