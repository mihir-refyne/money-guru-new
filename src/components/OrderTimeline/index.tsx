import { OrderStatus, OrderTimeline } from "@/lib/order";
import { formatDate } from "@/lib/utils";
import styles from "./styles.module.css";

interface OrderTimelineCompProps {
  timeLine: OrderTimeline[];
  cancelledAt?: Date;
  eta?: Date;
}

const getLabelDescription = (
  status: OrderStatus,
  eta?: Date,
  occurredAt?: Date | null
): string => {
  switch (status) {
    case "FULFILLED":
      return occurredAt ? "Delivered on" : eta ? "Delivery by" : "Ordered on";
    case "CANCELLED":
      return "Cancelled at";
    default:
      return "Ordered on";
  }
};

const getLabel = (
  status: OrderStatus,
  occurredAt: Date | null,
  eta?: Date
): string => {
  switch (status) {
    case "PENDING":
      return "Ordered";
    case "CANCELLED":
      return "Cancelled";
    case "FULFILLED":
      return occurredAt ? "Delivered" : eta ? "To be delivered" : "Delivered";
    default:
      return "Ordered";
  }
};

const getDate = (occurredAt: Date | null, eta?: Date): string => {
  if (occurredAt) return formatDate(occurredAt.toString());
  if (eta) return formatDate(eta.toString());
  return "";
};

export function OrderTimelineComp({
  timeLine,
  cancelledAt,
  eta,
}: OrderTimelineCompProps) {
  const filteredTimeline = timeLine.filter((event) => {
    const { status } = event;

    return status !== "INITIATED" && !(status === "FULFILLED" && cancelledAt);
  });

  return (
    <div className={styles.wrapper}>
      <ul className={styles.sessions}>
        {filteredTimeline.map((event, index) => {
          const { occurredAt, status } = event;

          const label = getLabel(status, occurredAt, eta);
          const labelDesc = getLabelDescription(status, eta, occurredAt);
          const date = getDate(occurredAt, eta);

          const hasValidDate = !!date;
          const isOrderInTerminalState =
            status === "CANCELLED" ||
            (status === "FULFILLED" && occurredAt === null && eta !== null);

          return (
            <li
              key={index}
              className={
                !isOrderInTerminalState && hasValidDate ? styles.hasDate : ""
              }
            >
              <p className={styles.description}>{label}</p>
              {hasValidDate && (
                <div className={styles.time}>{`${labelDesc} ${date}`}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
