import { ReactElement, useEffect } from "react";
import styles from "./styles.module.css";
import { CheckCircle } from "phosphor-react";

interface TaskCardProps {
  children:
    | ReactElement<TaskCardItemProps>
    | Array<ReactElement<TaskCardItemProps>>;
}

export function TaskCard({ children }: TaskCardProps) {
  return <div className={styles.TaskCard}>{children}</div>;
}

export interface TaskCardItemProps {
  leftIconUrl?: string;
  text: string;
  totalCount?: number;
  completedCount?: number;
  onClick?: () => void;
  onMount?: () => void;
}

function constructDisplayCount(
  totalCount?: number,
  completedCount?: number
): string | undefined {
  if (totalCount !== undefined && completedCount !== undefined)
    return `${completedCount}/${totalCount}`;
  if (totalCount !== undefined) return totalCount.toString();
}

export function TaskCardItem({
  leftIconUrl,
  text,
  totalCount,
  completedCount,
  onClick,
  onMount,
}: TaskCardItemProps) {
  useEffect(() => onMount?.(), []);
  const isClickable = !!onClick;
  const RootElem = isClickable ? "button" : "div";

  const countDisplay = constructDisplayCount(totalCount, completedCount);
  const completed =
    totalCount !== undefined && completedCount !== undefined
      ? totalCount === completedCount
      : false;

  const LeftIcon = completed ? (
    <CheckCircle
      size={32}
      weight="fill"
      color="var(--clr-info-success-default)"
    />
  ) : leftIconUrl ? (
    <img src={leftIconUrl} alt={text} />
  ) : null;

  return (
    <RootElem
      className={`${styles.TaskCardItem} ${
        completed ? styles["TaskCardItem--completed"] : ""
      }`}
      onClick={onClick}
      disabled={completed}
    >
      {LeftIcon}
      <p className={styles.TaskCardItem__Content}>{text}</p>
      {countDisplay && (
        <div className={styles.TaskCardItem__Count}>{countDisplay}</div>
      )}
    </RootElem>
  );
}
