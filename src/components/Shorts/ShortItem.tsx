import { useOnScreen } from "@/hooks/useOnScreen";
import { ShareNetwork } from "phosphor-react";
import { ReactNode, useState } from "react";
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
  shareCtaType?: "COPY" | "SHARE";
  onShareClick?: () => void;
}

export default function ShortItem({
  swipePrompt,
  data,
  onView,
  onLeave,
  shareCtaType = "COPY",
  onShareClick,
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
      {shareCtaType && (
        <ShareOrCopyButton type={shareCtaType} onClick={onShareClick} />
      )}
    </SwipePrompt>
  );
}

function ShareOrCopyButton(props: {
  type: "SHARE" | "COPY";
  onClick?: () => void;
}) {
  const { type, onClick } = props;
  const [copied, setCopied] = useState(false);

  function handleClick() {
    onClick?.();
    if (type === "COPY") {
      setCopied(true);
      const id = setTimeout(() => {
        setCopied(false);
      }, 2 * 1000);

      return () => {
        setCopied(false);
        clearTimeout(id);
      };
    }
  }

  const label = type === "SHARE" ? "Share" : copied ? "Copied" : "Copy Link";
  const btnTypeClass = copied ? "btn-success-light" : "btn-primary-light";

  return (
    <button
      className={`btn ${btnTypeClass} flex-center btn-block mt-4`}
      onClick={handleClick}
    >
      <ShareNetwork size={24} className="mr-2" />
      <span>{label}</span>
    </button>
  );
}
