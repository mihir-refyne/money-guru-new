import { ReactNode } from "react";
import styles from "./styles.module.css";

interface CardV2Props {
  children: ReactNode;
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImageUrl?: string;
  backgroundSize?: string;
  boxShadow?: string;
  border?: string;
  footer?: ReactNode;
  footerBackgroundColor?: string;
}

export default function CardV2({
  backgroundImageUrl,
  backgroundColor,
  backgroundGradient,
  backgroundSize,
  boxShadow,
  border,
  children,
  footer,
  footerBackgroundColor,
}: CardV2Props) {
  const backgroundImageProperty = backgroundImageUrl
    ? `url(${backgroundImageUrl})`
    : undefined;
  const backgroundColorProperty = backgroundColor
    ? `linear-gradient(to right, ${backgroundColor}, ${backgroundColor})`
    : undefined;
  const backgroundProperty = [
    backgroundImageProperty,
    backgroundGradient,
    backgroundColorProperty,
  ]
    .filter(Boolean)
    .join(", ");
  const hasFooter = !!footer;
  const cardClassName = hasFooter
    ? `${styles.Card} ${styles.Card__WithFooter}`
    : styles.Card;
  return (
    <div>
      <div
        className={cardClassName}
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
