import chevronDown from "@/images/chevron-down.svg";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import Image from "next/image";
import { useState } from "react";
import styles from "./CreditScoreBuilderFAQCard.module.css";

export default function CreditScoreBuilderFAQCard({
  answer,
  question,
}: {
  question: string;
  answer: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={styles.Card}>
      <button
        className={styles.CardHeading}
        data-active={isExpanded}
        onClick={() => {
          logAnalyticsEvent(
            ["mixpanel", "webengage"],
            AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
            {
              source: "FAQ",
              cta: "FAQ",
            }
          );
          setIsExpanded((isExpanded) => !isExpanded);
        }}
      >
        <p>{question}</p>
        <Image
          src={chevronDown}
          alt="expand"
          style={{
            transform: isExpanded ? "rotate(180deg)" : "",
            transition: "transform 200ms",
          }}
        />
      </button>
      {isExpanded && <div className={styles.CardContent}>{answer}</div>}
    </div>
  );
}
