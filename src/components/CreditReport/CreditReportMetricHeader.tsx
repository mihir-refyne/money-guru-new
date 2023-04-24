import styles from "./CreditReportMetricHeader.module.css";

interface CreditReportMetricHeaderProps {
  illustrationUrl?: string;
  children: string;
}

export default function CreditReportMetricHeader({
  illustrationUrl,
  children,
}: CreditReportMetricHeaderProps) {
  return (
    <div className={styles.CreditReportMetricHeader}>
      <p className="clr-text-secondary">{children}</p>
      {illustrationUrl && (
        <img src={illustrationUrl} alt="Credit Report Metric" />
      )}
    </div>
  );
}
