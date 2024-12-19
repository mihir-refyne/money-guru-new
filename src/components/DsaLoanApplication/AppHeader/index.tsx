import { useRouter } from 'next/router';
import { CaretLeft } from 'phosphor-react';
import styles from './styles.module.css';
import { useEffect, useRef } from 'react';
import { dispatchDataToNativePlatform } from '@/lib/webview';

export default function AppHeader() {
  const router = useRouter();
  const isBackTriggerAvailable = useRef<boolean>(false);
  const SYNTHETIC_TIMEOUT_TO_CHECK_IF_BACK_ACTION_HAPPENED_IN_MS = 5;

  useEffect(() => {
    function handlePopState(this: Window, event: PopStateEvent) {
      isBackTriggerAvailable.current = true;
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleBack = () => {
      isBackTriggerAvailable.current = false;
      
      const isThankYouPage = router.pathname.includes('thank-you');
      
      if (isThankYouPage) {
        router.push('/dsa-loan-journey/loan-application?type=' + router.query.type)
      } else {
        router.back();
      }
  
      setTimeout(() => {
        if (!isBackTriggerAvailable.current) {
          dispatchDataToNativePlatform({
            type: "POP",
          });
        }
      }, SYNTHETIC_TIMEOUT_TO_CHECK_IF_BACK_ACTION_HAPPENED_IN_MS);
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
