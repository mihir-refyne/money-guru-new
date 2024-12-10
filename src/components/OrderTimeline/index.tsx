import { OrderStatus, OrderTimeline } from "@/lib/order";
import { formatDate } from "@/lib/utils";
import styles from "./styles.module.css";

interface OrderTimelineCompProps {
  timeLine: OrderTimeline[];
}

export function OrderTimelineComp({ timeLine }: OrderTimelineCompProps) {
  const statusLabels: Record<Exclude<OrderStatus, "INITIATED">, string> = {
    PENDING: "Ordered",
    FULFILLED: "Delivered",
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

          // Conditionally add the 'has-date' class if date is not empty
          const liClass = date ? styles.hasDate : "";

          return (
            <li key={index} className={liClass}>
              <p className={styles.description}>{label}</p>
              {date !== "" && (
                <div className={styles.time}>{`Ordered on ${date}`}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
