import React, { ReactNode } from "react";
import styles from "./styles.module.css";

export type TagType = "success" | "success-light" | "warning" | "warning-light" | "error" | "error-light";

const TAG_TYPE_TO_CSS_CLASS_MAP: Record<TagType, string> = {
  success: styles.Tag__success,
  "success-light": styles["Tag__success-light"],
  warning: styles.Tag__warning,
  "warning-light": styles["Tag__warning-light"],
  error: styles.Tag__error,
  "error-light": styles["Tag__error-light"]
};

interface TagProps {
  type?: TagType;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: string;
  onClick?: () => void;
}

export default function Tag({
  type,
  leftIcon,
  rightIcon,
  children,
  onClick,
}: TagProps) {
  return (
    <div
      className={`${styles.Tag} ${
        type ? TAG_TYPE_TO_CSS_CLASS_MAP[type] : ""
      } ${onClick ? styles.Tag__clickable : undefined}`}
      role={onClick ? "button" : undefined}
      onClick={onClick}
    >
      {leftIcon}
      <span className="text-caption text-capitalize">{children}</span>
      {rightIcon}
    </div>
  );
}
