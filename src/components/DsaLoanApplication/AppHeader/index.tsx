import { useRouter } from 'next/router';
import { CaretLeft } from 'phosphor-react';
import styles from './styles.module.css';

export default function AppHeader() {
  const router = useRouter();
  
  const handleBack = () => {
    const isThankYouPage = router.pathname.includes('thank-you');
    if (isThankYouPage) {
      router.push('/dsa-loan-journey/loan-application?type=' + router.query.type);
    } else {
      router.back();
    }
  };

  return (
    <header className={styles.header}>
      <button 
        onClick={handleBack} 
        className={styles.backButton}
        aria-label="Go back to previous page"
      >
        <CaretLeft size={24} />
      </button>
    </header>
  );
}
