import Modal from "@/components/Modal";
import { useRouter } from "next/router";
import { WarningCircle } from "phosphor-react";
import styles from "./AlternateNumberErrorModal.module.css";

interface AlternateNumberErrorModalProps {
  active: boolean;
  onClose?: () => void;
}

export default function AlternateNumberErrorModal({ active, onClose }: AlternateNumberErrorModalProps) {
  const router = useRouter();

  function handleVerifyNumber() {
    router.push("/alternate-number");
    if (onClose) onClose();
  }

  return (
    <Modal active={active} onClose={onClose} bottomSheetOnMobile>
      <div className={styles.modalContent}>
        <WarningCircle size={48} className={styles.icon} />
        <h2 className={styles.heading}>Couldn’t fetch your credit report</h2>
        <p className={styles.description}>Link your phone number registered with your bank</p>
        <button className={styles.button} onClick={handleVerifyNumber}>
          Verify your number
        </button>
      </div>
    </Modal>
  );
}
