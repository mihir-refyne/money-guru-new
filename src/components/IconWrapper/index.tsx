import { ReactElement } from "react";
import styles from "./styles.module.css";

interface IconWrapperProps {
  circular?: boolean;
  children: ReactElement;
  backgroundColor?: string;
}

export default function IconWrapper({
  circular = false,
  backgroundColor,
  children,
}: IconWrapperProps) {
  return (
    <div
      className={`${styles.IconWrapper} ${
        circular ? styles.IconWrapper__circular : ""
      }`}
      style={{
        backgroundColor,
      }}
    >
      {children}
    </div>
  );
}
