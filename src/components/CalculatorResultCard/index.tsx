import useTranslation from "@/hooks/useTranslation";
import styles from "./styles.module.css";

export interface CalculatorResultLineItem {
  label: string;
  value: string;
  emphasis?: boolean;
}

export interface CalculatorResultCardProps {
  summary: string;
  lineItems: Array<CalculatorResultLineItem>;
  nextStepLabel?: string;
  onNextStepClick?: () => void;
}

export default function CalculatorResultCard({
  summary,
  lineItems,
  nextStepLabel,
  onNextStepClick,
}: CalculatorResultCardProps) {
  const { t } = useTranslation("common");

  return (
    <div className={styles.CalculatorResultCard}>
      <p className={styles.CalculatorResultCard__Summary}>{summary}</p>
      <div className={styles.CalculatorResultCard__LineItems}>
        {lineItems.map((item) => (
          <div
            key={item.label}
            className={`${styles.CalculatorResultCard__LineItem} ${
              item.emphasis
                ? styles["CalculatorResultCard__LineItem--emphasis"]
                : ""
            }`}
          >
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
      <p className={styles.CalculatorResultCard__Disclaimer}>
        {t("money_guru_calculator_estimate_disclaimer")}
      </p>
      {nextStepLabel && onNextStepClick && (
        <button
          type="button"
          className={styles.CalculatorResultCard__NextStep}
          onClick={onNextStepClick}
        >
          {nextStepLabel}
        </button>
      )}
    </div>
  );
}
