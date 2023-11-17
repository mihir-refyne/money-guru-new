import React, { ReactElement, ReactNode } from "react";
import { CaretRight } from "phosphor-react";
import styles from "./styles.module.css";

interface ListCardProps {
  className?: string;
  background?: string;
  border?: string;
  items: Array<ListCardItemProps>;
}

export default function ListCard({
  className = "",
  items,
  border,
  background,
}: ListCardProps) {
  return (
    <div
      className={`${styles.ListCard} ${className}`}
      role="listbox"
      style={{ background, border }}
    >
      {items.map((item, index) => (
        <ListCardItem key={index} {...item} />
      ))}
    </div>
  );
}

export interface ListCardItemProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  contentLeftTitle?: string;
  contentLeftDescription?: string;
  contentRightTitle?: string;
  contentRightTitleClassName?: string;
  contentRightDescription?: string | ReactElement;
  contentRightDescriptionFontColor?: string;
  alignItems?: "start" | "center";
  hasGapBetweenContentItems?: boolean;
  onClick?: () => void;
}

function ListCardItem({
  leftIcon,
  rightIcon,
  contentLeftTitle,
  contentLeftDescription,
  contentRightTitle,
  contentRightTitleClassName,
  contentRightDescription,
  contentRightDescriptionFontColor,
  alignItems = "start",
  hasGapBetweenContentItems = true,
  onClick,
}: ListCardItemProps) {
  function renderRightContentDescription(content?: string | ReactElement) {
    if (!content) return null;
    if (typeof content !== "string") return content;
    return (
      <p
        className="text-caption text-semibold text-capitalize"
        style={{
          color: contentRightDescriptionFontColor,
        }}
      >
        {content}
      </p>
    );
  }

  const isClickable = !!onClick;
  const _rightIcon = rightIcon ?? isClickable ? <CaretRight size={16} /> : null;
  const alignClassName = styles[`align-${alignItems}`];
  return (
    <div
      className={`${styles.ListCardItem} ${alignClassName}`}
      role={isClickable ? "button" : undefined}
      onClick={onClick}
    >
      {leftIcon && <div className={styles.ListCardItem__Icon}>{leftIcon}</div>}
      <div
        className={`${styles.ListCardItem__Content} ${alignClassName} ${
          hasGapBetweenContentItems ? styles.HasGap : ""
        }`}
      >
        <div className={styles.ListCardItem__Content__Item}>
          {contentLeftTitle && (
            <h5 className="text-medium">{contentLeftTitle}</h5>
          )}
          {contentLeftDescription && (
            <p className="text-caption clr-text-secondary">
              {contentLeftDescription}
            </p>
          )}
        </div>
        <div className={`${styles.ListCardItem__Content__Item} text-right`}>
          {contentRightTitle && (
            <h5 className={`text-medium ${contentRightTitleClassName ?? ""}`}>
              {contentRightTitle}
            </h5>
          )}
          {renderRightContentDescription(contentRightDescription)}
        </div>
      </div>
      {_rightIcon && <div className="flex-center">{_rightIcon}</div>}
    </div>
  );
}
