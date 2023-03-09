import { CSSProperties, ReactNode } from "react";
import styles from "./ShortsContainer.module.css";

interface ShortsContainerProps {
  scrollable?: boolean;
  children: ReactNode;
}

export default function ShortsContainer({
  scrollable = true,
  children,
}: ShortsContainerProps) {
  const style: CSSProperties | undefined = !scrollable
    ? { overflowY: "hidden" }
    : undefined;
  return (
    <div className={styles.ShortsContainer} style={style}>
      {children}
    </div>
  );
}
