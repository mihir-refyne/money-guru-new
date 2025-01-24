import { OrderStatus, OrderTimeline } from "@/lib/order";
import { formatDate } from "@/lib/utils";
import styles from "./styles.module.css";

interface OrderTimelineCompProps {
  timeLine: OrderTimeline[];
}

const STATUS_TO_COMPLETED_LABEL_MAP: Record<OrderStatus, string | null> = {
  PENDING: "Ordered",
  INITIATED: null,
  SHIPPED: "Shipped",
  FULFILLED: "Delivered",
  CANCELLED: "Cancelled",
};
const STATUS_TO_PENDING_DESCRIPTION_MAP: Record<OrderStatus, string | null> = {
  PENDING: null,
  INITIATED: null,
  SHIPPED: "Ship by",
  FULFILLED: "Delivery by",
  CANCELLED: null,
};
const STATUS_TO_COMPLETED_DESCRIPTION_MAP: Record<OrderStatus, string | null> =
  {
    PENDING: "Ordered on",
    INITIATED: null,
    SHIPPED: "Shipped on",
    FULFILLED: "Delivered on",
    CANCELLED: "Cancelled on",
  };

interface OrderTimelineItem {
  completed: boolean;
  label: string;
  description?: string;
}

function getOrderTimelineItemProps(
  timelineItem: OrderTimeline
): OrderTimelineItem | null {
  const completed = !!timelineItem.occurredAt;
  const label = STATUS_TO_COMPLETED_LABEL_MAP[timelineItem.status];
  if (!label) return null;
  const updatedLabel = completed ? label : `To be ${label.toLowerCase()}`;
  const descriptionPrefix = completed
    ? STATUS_TO_COMPLETED_DESCRIPTION_MAP[timelineItem.status]
    : STATUS_TO_PENDING_DESCRIPTION_MAP[timelineItem.status];
  const descriptionDate = completed
    ? timelineItem.occurredAt
    : timelineItem.eta;
  const descriptionSuffix = descriptionDate && formatDate(descriptionDate);
  const description =
    descriptionPrefix && descriptionSuffix
      ? [descriptionPrefix, descriptionSuffix].join(" ")
      : undefined;
  return {
    completed,
    label: updatedLabel,
    description,
  };
}

export function OrderTimelineComp({ timeLine }: OrderTimelineCompProps) {
  // INFO: Removing `INITIATED` for now, since PENDING & INITIATED happens mostly at same time
  const filteredTimeline = timeLine.filter(
    (event) => event.status !== "INITIATED"
  );

  return (
    <div className={styles.wrapper}>
      <ul className={styles.sessions}>
        {filteredTimeline.map((timelineItem, index) => {
          const props = getOrderTimelineItemProps(timelineItem);
          if (!props) return null;
          return (
            <li key={index} className={props.completed ? styles.completed : ""}>
              <p className={styles.description}>{props.label}</p>
              {props.description && (
                <div className={styles.time}>{props.description}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
