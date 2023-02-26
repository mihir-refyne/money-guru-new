import { useOnScreen } from "@/hooks/useOnScreen";
import { ShareNetwork } from "phosphor-react";
import { ReactNode } from "react";
import SwipePrompt from "../SwipePrompt";
import styles from "./ShortItem.module.css";

export interface ShortData {
  id: string;
  media?: {
    type: "image";
    url: string;
  };
  tag?: string;
  content?: ReactNode;
  share?: {
    imageUrl?: string;
    url?: string;
    text: string;
  };
}

interface ShortItemProps {
  swipePrompt?: {
    location: "top" | "bottom";
    text: string;
  };
  data: ShortData;
  onView?: (id: string) => void;
  onLeave?: (id: string, direction?: string) => void;
}

export default function ShortItem({
  swipePrompt,
  data,
  onView,
  onLeave,
}: ShortItemProps) {
  const { ref } = useOnScreen<HTMLDivElement>({
    options: {
      rootMargin: "48px 0px 0px 0px",
      threshold: 0.51,
    },
    onEnter: () => onView?.(data.id),
    onLeave: (direction) => onLeave?.(data.id, direction),
  });

  return (
    <SwipePrompt
      ref={ref}
      id={data.id}
      active={!!swipePrompt}
      position={swipePrompt?.location}
      prompt={swipePrompt?.text}
      className={styles.ShortItem}
    >
      {data.media && (
        <figure>
          <img
            src={data.media.url}
            alt={"ADD Alt here"}
            className={styles.ShortItem__Image}
            loading="lazy"
          />
        </figure>
      )}
      {data.content && (
        <div className={styles.ShortItem__Content}>{data.content}</div>
      )}
      {data.share && (
        <button className="btn btn-primary-light flex-center btn-block mt-4">
          <ShareNetwork size={24} className="mr-2" />
          <span>Share</span>
        </button>
      )}
    </SwipePrompt>
  );
}
