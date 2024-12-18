import { useRouter } from 'next/router';
import styles from './styles.module.css';

export default function Footer() {
  const router = useRouter();
  const loanType = (router.query.type as string) || 'home';

  const handleStartApplication = () => {
    router.push(`/dsa-loan-journey/loan-application/form?type=${loanType}`);
  };

  return (
    <footer className={styles.footer}>
      <p className={styles.disclaimer}>
        Turn Your Dream {loanType === 'home' ? 'Home' : 'Education'} into Reality
      </p>
      <button 
        className={styles.button}
        onClick={handleStartApplication}
      >
        Start Your Application
      </button>
    </footer>
  );
}
