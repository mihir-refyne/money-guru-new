import { X } from "phosphor-react";
import { ReactNode, useEffect } from "react";
import styles from "./styles.module.css";

interface ModalProps {
  active: boolean;
  bottomSheetOnMobile?: boolean;
  onClose?: () => void;
  children: ReactNode;
  freezeBackgroundOnModalOpen?: boolean;
}

export default function Modal({
  active,
  bottomSheetOnMobile = false,
  onClose,
  children,
  freezeBackgroundOnModalOpen = true,
}: ModalProps) {
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (active && freezeBackgroundOnModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [active, freezeBackgroundOnModalOpen]);

  return (
    <div
      className={`${styles.Modal} ${active ? styles.active : ""} ${
        bottomSheetOnMobile ? styles.BottomSheetOnMobile : ""
      }`}
      aria-hidden={!active}
    >
      <div className={styles.ModalContent}>
        {!!onClose && (
          <button className={styles.ModalClose} onClick={() => onClose()}>
            <X />
          </button>
        )}
        {active && <div className={styles.ModalContent__Body}>{children}</div>}
      </div>
    </div>
  );
}
