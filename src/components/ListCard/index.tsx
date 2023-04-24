import React, { ReactNode } from "react";
import { CaretRight } from "phosphor-react";
import styles from "./styles.module.css";

interface ListCardProps {
  className?: string;
  items: Array<ListCardItemProps>;
}

export default function ListCard({ className = "", items }: ListCardProps) {
  return (
    <div className={`${styles.ListCard} ${className}`} role="listbox">
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
  contentRightDescription?: string;
  contentRightDescriptionFontColor?: string;
  onClick?: () => void;
}

function ListCardItem({
  leftIcon,
  rightIcon,
  contentLeftTitle,
  contentLeftDescription,
  contentRightTitle,
  contentRightDescription,
  contentRightDescriptionFontColor,
  onClick,
}: ListCardItemProps) {
  const isClickable = !!onClick;
  const _rightIcon = rightIcon ?? isClickable ? <CaretRight size={16} /> : null;
  return (
    <div
      className={styles.ListCardItem}
      role={isClickable ? "button" : undefined}
      onClick={onClick}
    >
      {leftIcon && <div className={styles.ListCardItem__Icon}>{leftIcon}</div>}
      <div className={styles.ListCardItem__Content}>
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
            <h5 className="text-medium">{contentRightTitle}</h5>
          )}
          {contentRightDescription && (
            <p
              className="text-caption text-medium text-capitalize"
              style={{
                color: contentRightDescriptionFontColor,
              }}
            >
              {contentRightDescription}
            </p>
          )}
        </div>
      </div>
      {_rightIcon && <div className="flex-center">{_rightIcon}</div>}
    </div>
  );
}
