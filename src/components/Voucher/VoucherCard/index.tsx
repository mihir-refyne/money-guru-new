import { ReactNode } from "react";
import styles from "./styles.module.css";

interface VoucherCardProps {
  children: ReactNode;
  bodyCentered?: boolean;
  footer?: ReactNode;
}

// TODO: Move it to CardV2 component
export default function VoucherCard({ children, bodyCentered = false, footer }: VoucherCardProps) {
  return (
    <div className={styles.VoucherCard}>
      <div
        className={`${styles.VoucherCard_Body} ${
          bodyCentered ? styles.Centered : ""
        }`}
      >
        {children}
      </div>
      {footer && <div className={styles.VoucherCard_Footer}>{footer}</div>}
    </div>
  );
}
