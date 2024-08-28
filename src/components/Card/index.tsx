import { ReactNode } from "react";
import styles from "./styles.module.css";

interface CardProps {
  children: ReactNode;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundSize?: string;
  boxShadow?: string;
  border?: string;
  footer?: ReactNode;
  footerBackgroundColor?: string;
}

export default function Card({
  backgroundImageUrl,
  backgroundColor,
  backgroundSize,
  boxShadow,
  border,
  children,
  footer,
  footerBackgroundColor,
}: CardProps) {
  const backgroundImageProperty = backgroundImageUrl
    ? `url(${backgroundImageUrl})`
    : undefined;
  const backgroundColorProperty = backgroundColor
    ? `linear-gradient(to right, ${backgroundColor}, ${backgroundColor})`
    : undefined;
  const backgroundProperty = [backgroundImageProperty, backgroundColorProperty]
    .filter(Boolean)
    .join(", ");
  return (
    <div>
      <div
        className={styles.Card}
        style={{
          backgroundImage: backgroundProperty,
          backgroundPositionX: "right",
          backgroundRepeat: "no-repeat",
          backgroundSize: backgroundSize,
          boxShadow,
          border,
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          className={styles.Card__Footer}
          style={{
            backgroundColor: footerBackgroundColor,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
