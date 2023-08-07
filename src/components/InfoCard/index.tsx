import React, { ReactNode } from "react";
import { Info } from "phosphor-react";
import styles from "./styles.module.css";

interface InfoCardProps {
  icon?: ReactNode;
  children?: ReactNode;
  transparentBackground?: boolean;
}

export default function InfoCard({
  icon,
  children,
  transparentBackground = false,
}: InfoCardProps) {
  return (
    <div
      className={`${styles.InfoCard} ${
        transparentBackground ? styles.InfoCard__Transparent : ""
      }`}
    >
      <div className={styles.InfoCard__Icon}>{icon ?? <Info size={16} />}</div>
      <div className="text-caption">{children}</div>
    </div>
  );
}
