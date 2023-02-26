import { useOnScreen } from "@/hooks/useOnScreen";
import { BellRinging, ShareNetwork } from "phosphor-react";
import { ReactNode, useState } from "react";
import SwipePrompt from "../SwipePrompt";
import styles from "./ShortItem.module.css";
import emptyBoxIllustrationUrl from "@/images/empty-box-illustration.svg";
import Image from "next/image";

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
  type?: "SHORT" | "FILLER" | "END";
  swipePrompt?: {
    location: "top" | "bottom";
    text: string;
  };
  data?: ShortData;
  onView?: (id?: string) => void;
  onLeave?: (id?: string, direction?: string) => void;
  shareCtaType?: "COPY" | "SHARE";
  onShareClick?: () => void;
  onNotifyClick?: () => void;
}

export default function ShortItem({
  type = "SHORT",
  swipePrompt,
  data,
  onView,
  onLeave,
  shareCtaType = "COPY",
  onShareClick,
  onNotifyClick,
}: ShortItemProps) {
  const { ref } = useOnScreen<HTMLDivElement>({
    options: {
      rootMargin: "48px 0px 0px 0px",
      threshold: 0.51,
    },
    onEnter: () => onView?.(data?.id),
    onLeave: (direction) => onLeave?.(data?.id, direction),
  });

  return (
    <SwipePrompt
      ref={ref}
      id={data?.id}
      active={!!swipePrompt}
      position={swipePrompt?.location}
      prompt={swipePrompt?.text}
      className={`${styles.ShortItem} ${
        type === "END" ? styles.ShortItem__AlignCenter : ""
      }`}
    >
      {type === "SHORT" && data && (
        <>
          {data.media && (
            <figure className={styles.ShortItem__Image__Wrapper}>
              {data.tag && (
                <span className={styles.ShortItem__Tag}>{data.tag}</span>
              )}
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
        </>
      )}
      {/* TODO: Filler */}
      {type === "END" && (
        <>
          <div className={styles.ShortItem__End__Content}>
            <Image src={emptyBoxIllustrationUrl} alt="ill" />
            <h3 className="text-sub-title mt-4">Well Done!</h3>
            <p className="text-heading clr-text-secondary text-center mt-4">
              You’ve finished all the R-Shorts. We’ll be adding more soon…
            </p>
          </div>
          <button
            className="btn btn-primary flex-center btn-block"
            onClick={onNotifyClick}
          >
            <BellRinging size={24} className="mr-2" />
            <span>Notify Me</span>
          </button>
        </>
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
      disabled={copied}
    >
      <ShareNetwork size={24} className="mr-2" />
      <span>{label}</span>
    </button>
  );
}
