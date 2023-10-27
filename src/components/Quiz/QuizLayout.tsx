import { ReactElement } from "react";
import styles from "./QuizLayout.module.css";

interface QuizLayoutProps {
  footer?: ReactElement;
  children: ReactElement;
}

export default function QuizLayout({ footer, children }: QuizLayoutProps) {
  return (
    <div className={styles.QuizLayout}>
      <div className={styles.QuizLayout__Body}>{children}</div>
      {footer && <div className={styles.QuizLayout__Footer}>{footer}</div>}
    </div>
  );
}
