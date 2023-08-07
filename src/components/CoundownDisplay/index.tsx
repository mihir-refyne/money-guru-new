import { useEffect } from "react";
import Separator from "../Separator";
import { durationInSecondsToDayMinHrSec } from "@/lib/utils";
import useCountdown from "@/hooks/useCountdown";
import styles from "./styles.module.css";
import useTranslation from "@/hooks/useTranslation";

interface CountdownDisplayProps {
  durationInSec: number;
  stepInSec?: number;
  separatorColor?: string;
  onFinish?: () => void;
}

export default function CountdownDisplay({
  durationInSec,
  stepInSec = 1,
  separatorColor,
  onFinish,
}: CountdownDisplayProps) {
  const { t } = useTranslation("common");
  const { remainingCount } = useCountdown({
    countForInSec: durationInSec,
    intervalInSec: stepInSec,
    onExpiry: onFinish,
  });

  const { days, hours, minutes, seconds } =
    durationInSecondsToDayMinHrSec(remainingCount);

  const itemsToBeDisplayed: Array<{ label: string; value: number }> = [
    {
      label: t("timer_days"),
      value: days,
    },
    {
      label: t("timer_hours"),
      value: hours,
    },
    {
      label: t("timer_minutes"),
      value: minutes,
    },
    {
      label: t("timer_seconds"),
      value: seconds,
    },
  ];

  return (
    <div className={styles.CountdownDisplay}>
      <Separator spacing={3} separatorColor={separatorColor}>
        {itemsToBeDisplayed.map((item, index) => (
          <div key={index} className={styles.CountdownDisplay__Item}>
            <h3 className="text-sub-title text-semibold">
              {item.value.toString().padStart(2, "0")}
            </h3>
            <p className="text-caption clr-text-secondary">{item.label}</p>
          </div>
        ))}
      </Separator>
    </div>
  );
}
