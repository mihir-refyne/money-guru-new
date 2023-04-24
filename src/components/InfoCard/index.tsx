import React, { ReactNode } from "react";
import { Info } from "phosphor-react";
import styles from "./styles.module.css";

interface InfoCardProps {
  icon?: ReactNode;
  children?: ReactNode;
}

export default function InfoCard({ icon, children }: InfoCardProps) {
  return (
    <div className={styles.InfoCard}>
      <div className={styles.InfoCard__Icon}>
        {icon ?? <Info size={16} />}
      </div>
      <div className="text-caption">{children}</div>
    </div>
  );
}
