import React from "react";
import Tag, { TagType } from "../Tag";
import CommonFooter from "./CreditReportLayout/CommonFooter";
import styles from "./CreditReportMetricsExplainer.module.css";

export interface CreditReportMetricsExplainerProps {
  title?: string;
  description?: string;
  tags?: Array<{
    type: TagType;
    text: string;
    description: string;
  }>;
  footer?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export default function CreditReportMetricsExplainer({
  title,
  description,
  tags,
  footer,
  ctaLabel,
  onCtaClick,
}: CreditReportMetricsExplainerProps) {
  return (
    <div>
      {title && <h2 className="text-heading text-semibold">{title}</h2>}
      {description && <p className="clr-text-secondary mt-2">{description}</p>}
      {tags && (
        <div className={styles.CreditReportMetricsExplainer__Tags}>
          {tags.map((tag, index) => (
            <div
              key={index}
              className={styles.CreditReportMetricsExplainer__TagItem}
            >
              <div
                className={
                  styles.CreditReportMetricsExplainer__TagItem__InnerTag
                }
              >
                <Tag type={tag.type}>{tag.text}</Tag>
              </div>
              <p
                className="text-right"
                dangerouslySetInnerHTML={{
                  __html: tag.description,
                }}
              ></p>
            </div>
          ))}
        </div>
      )}
      {footer && (
        <p className="text-caption clr-text-secondary mt-6">{footer}</p>
      )}
      <div className={styles.CreditReportMetricsExplainer__Footer}>
        {ctaLabel && (
          <button className="btn btn-primary btn-block" onClick={onCtaClick}>
            {ctaLabel}
          </button>
        )}
        <div className="mt-4">
          <CommonFooter />
        </div>
      </div>
    </div>
  );
}
