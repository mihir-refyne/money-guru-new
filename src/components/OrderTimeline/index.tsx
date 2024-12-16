import { OrderStatus, OrderTimeline } from "@/lib/order";
import { formatDate } from "@/lib/utils";
import styles from "./styles.module.css";

interface OrderTimelineCompProps {
  timeLine: OrderTimeline[];
  cancelledAt?: Date;
}

function getLabelDescription(status: OrderStatus) {
  if (status === "FULFILLED") return "Delivered on";
  if (status === "CANCELLED") return "Cancelled at";
  return "Ordered on";
}

export function OrderTimelineComp({
  timeLine,
  cancelledAt,
}: OrderTimelineCompProps) {
  const statusLabels: Record<Exclude<OrderStatus, "INITIATED">, string> = {
    PENDING: "Ordered",
    FULFILLED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return (
    <div className={styles.wrapper}>
      <ul className={styles.sessions}>
        {timeLine.map((event, index) => {
          const { occurredAt, status } = event;
          const date = occurredAt ? formatDate(occurredAt!.toString()) : "";
          const label =
            statusLabels[status as Exclude<OrderStatus, "INITIATED">];
          if (status === "INITIATED") return;
          if (status === "FULFILLED" && cancelledAt) return;

          // Conditionally add the 'has-date' class if date is not empty
          const liClass = date ? styles.hasDate : "";
          const labelDesc = getLabelDescription(status);

          return (
            <li key={index} className={status === "CANCELLED" ? "" : liClass}>
              <p className={styles.description}>{label}</p>
              {date !== "" && (
                <div className={styles.time}>{`${labelDesc} ${date}`}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
