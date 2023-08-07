import { ReactElement, ReactNode } from "react";
import styles from "./IndependenceDayHero.module.css";

interface IndependenceDayHeroProps {
  children: ReactNode;
  background?: ReactElement;
  footer?: ReactElement;
  height?: string;
}

export default function IndependenceDayHero({
  children,
  background,
  footer,
  height,
}: IndependenceDayHeroProps) {
  return (
    <div
      className={styles.IndependenceDayHero}
      style={{
        height,
      }}
    >
      {background && (
        <div className={styles.IndependenceDayHero__Background}>
          {background}
        </div>
      )}
      <div className={styles.IndependenceDayHero__Content}>{children}</div>
      {footer && (
        <div className={styles.IndependenceDayHero__Footer}>{footer}</div>
      )}
    </div>
  );
}
