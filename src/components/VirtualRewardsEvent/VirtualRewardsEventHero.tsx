import { ReactElement, ReactNode } from "react";
import styles from "./VirtualRewardsEventHero.module.css";

interface VirtualRewardsEventHeroProps {
  children: ReactNode;
  background?: ReactElement;
  footer?: ReactElement;
  height?: string;
}

export default function VirtualRewardsEventHero({
  children,
  background,
  footer,
  height,
}: VirtualRewardsEventHeroProps) {
  return (
    <div
      className={styles.VirtualRewardsEventHero}
      style={{
        height,
      }}
    >
      {background && (
        <div className={styles.VirtualRewardsEventHero__Background}>
          {background}
        </div>
      )}
      <div className={styles.VirtualRewardsEventHero__Content}>{children}</div>
      {footer && (
        <div className={styles.VirtualRewardsEventHero__Footer}>{footer}</div>
      )}
    </div>
  );
}
