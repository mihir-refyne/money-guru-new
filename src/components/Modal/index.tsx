import { ReactNode } from "react";
import { X } from "phosphor-react";
import styles from "./styles.module.css";

interface ModalProps {
    active: boolean;
    bottomSheetOnMobile?: boolean;
    onClose?: () => void;
    children: ReactNode;
}

export default function Modal({ active, bottomSheetOnMobile = false, onClose, children }: ModalProps) {
    return (
        <div className={`${styles.Modal} ${active ? styles.active : ""} ${bottomSheetOnMobile ? styles.BottomSheetOnMobile : ""}`} aria-hidden={!active}>
            <div className={styles.ModalContent}>
                {!!onClose && <button className={styles.ModalClose} onClick={onClose}><X /></button>}
                {active && children}
            </div>
        </div>
    )
}
