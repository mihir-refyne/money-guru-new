import React, { ReactNode } from "react";
import styles from "./styles.module.css";

export type TagType =
  | "success"
  | "success-light"
  | "warning"
  | "warning-light"
  | "error"
  | "error-light"
  | "info-light"
  | "general"
  | "general-light";

const TAG_TYPE_TO_CSS_CLASS_MAP: Record<TagType, string> = {
  success: styles.Tag__success,
  "success-light": styles["Tag__success-light"],
  warning: styles.Tag__warning,
  "warning-light": styles["Tag__warning-light"],
  error: styles.Tag__error,
  "error-light": styles["Tag__error-light"],
  "info-light": styles["Tag__info-light"],
  general: styles.Tag_general,
  "general-light": styles["Tag__general-light"],
};

interface TagProps {
  type?: TagType;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  compact?: boolean;
  children: string;
  onClick?: () => void;
}

export default function Tag({
  type,
  className = "",
  leftIcon,
  rightIcon,
  compact = false,
  children,
  onClick,
}: TagProps) {
  return (
    <div
      className={`${styles.Tag} ${
        type ? TAG_TYPE_TO_CSS_CLASS_MAP[type] : ""
      } ${onClick ? styles.Tag__clickable : undefined} ${
        compact ? styles.Tag__compact : ""
      } ${className}`}
      role={onClick ? "button" : undefined}
      onClick={onClick}
    >
      {leftIcon}
      <span className="text-caption text-capitalize">{children}</span>
      {rightIcon}
    </div>
  );
}
