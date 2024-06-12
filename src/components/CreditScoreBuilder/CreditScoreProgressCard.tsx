import { CreditScoreBuilderProgress } from "@/components/CreditScoreBuilder/CreditScoreProgressSection";
import checkGreen from "@/images/check_green.svg";
import chevronRight from "@/images/chevron_right.svg";
import progressNone from "@/images/progress_none.svg";
import progressPending from "@/images/progress_pending.svg";
import withdrawalIcon from "@/images/withdrawal.svg";
import Image from "next/image";
import styles from "./CreditScoreProgressCard.module.css";

export default function CreditScoreProgressCard({
  progress = CreditScoreBuilderProgress["WITHDRAWAL_PENDING"],
  type,
  onClick,
  title,
  desc,
}: {
  title: string;
  desc?: string;
  progress?: CreditScoreBuilderProgress;
  type: "withdrawal" | "repayment" | "view_report";
  onClick?: () => void;
}) {
  if (type === "withdrawal") {
    return (
      <div
        data-active={
          progress === CreditScoreBuilderProgress["WITHDRAWAL_PENDING"]
        }
        data-lineblue={
          progress === CreditScoreBuilderProgress.REPAYMENT_PENDING
        }
        data-linegreen={progress > CreditScoreBuilderProgress.REPAYMENT_PENDING}
        className={styles.Card}
        role="button"
        onClick={() => {
          if (progress === CreditScoreBuilderProgress["WITHDRAWAL_PENDING"]) {
            onClick?.();
          }
        }}
      >
        {progress > CreditScoreBuilderProgress["WITHDRAWAL_PENDING"] ? (
          <Image src={checkGreen} alt="done" />
        ) : (
          <Image src={withdrawalIcon} alt="withdraw" />
        )}
        <div className="ml-3">
          <div
            data-active="true"
            className={`text-heading-small ${styles.Card__Heading}`}
          >
            {title}
          </div>
          <div className={`text-body ${styles.Card__SubText}`}>{desc}</div>
        </div>
        {progress === CreditScoreBuilderProgress["WITHDRAWAL_PENDING"] && (
          <Image
            src={chevronRight}
            style={{
              marginLeft: "auto",
            }}
            alt="Make a withdrawal"
          />
        )}
      </div>
    );
  }

  if (type === "repayment") {
    return (
      <div
        data-lineblue={
          progress === CreditScoreBuilderProgress.CREDIT_REPORT_PENDING
        }
        data-linegreen={
          progress > CreditScoreBuilderProgress.CREDIT_REPORT_PENDING
        }
        className={styles.Card}
      >
        {progress > CreditScoreBuilderProgress["REPAYMENT_PENDING"] && (
          <Image src={checkGreen} alt="done" />
        )}
        {progress === CreditScoreBuilderProgress["REPAYMENT_PENDING"] && (
          <Image src={progressPending} alt="done" />
        )}
        {progress < CreditScoreBuilderProgress["REPAYMENT_PENDING"] && (
          <Image src={progressNone} alt="done" />
        )}
        <div className="ml-3">
          <div
            data-active={
              progress > CreditScoreBuilderProgress["REPAYMENT_PENDING"]
            }
            className={`text-heading-small ${styles.Card__Heading}`}
          >
            {title}
          </div>
          <div className={`text-body ${styles.Card__SubText}`}>{desc}</div>
        </div>
      </div>
    );
  }

  if (type === "view_report") {
    return (
      <div
        data-active={
          progress === CreditScoreBuilderProgress["CREDIT_REPORT_GENERATED"]
        }
        className={styles.Card}
        role="button"
        onClick={() => {
          if (
            progress === CreditScoreBuilderProgress["CREDIT_REPORT_GENERATED"]
          ) {
            onClick?.();
          }
        }}
      >
        {progress > CreditScoreBuilderProgress["CREDIT_REPORT_PENDING"] && (
          <Image src={checkGreen} alt="done" />
        )}
        {progress === CreditScoreBuilderProgress["CREDIT_REPORT_PENDING"] && (
          <Image src={progressPending} alt="done" />
        )}
        {progress < CreditScoreBuilderProgress["CREDIT_REPORT_PENDING"] && (
          <Image src={progressNone} alt="done" />
        )}
        <div className="ml-3">
          <div
            data-active={
              progress > CreditScoreBuilderProgress["CREDIT_REPORT_PENDING"]
            }
            className={`text-heading-small ${styles.Card__Heading}`}
          >
            {title}
          </div>
          <div className={`text-body ${styles.Card__SubText}`}>{desc}</div>
        </div>
        {progress === CreditScoreBuilderProgress["CREDIT_REPORT_GENERATED"] && (
          <Image
            src={chevronRight}
            style={{
              marginLeft: "auto",
            }}
            alt="View your credit report"
          />
        )}
      </div>
    );
  }
  return null;
}
