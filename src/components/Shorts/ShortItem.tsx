import { useOnScreen } from "@/hooks/useOnScreen";
import { BellRinging, ShareNetwork } from "phosphor-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import SwipePrompt from "../SwipePrompt";
import ShortMedia from "./ShortMedia";
import styles from "./ShortItem.module.css";
import emptyBoxIllustrationUrl from "@/images/empty-box-illustration.svg";
import Image from "next/image";
import { hasShortViewHistory } from "@/lib/shorts";

const SWIPE_PROMPT_ANIMATION_DURATION_MS = 3 * 1000;

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
  isShareLoading?: boolean;
  shareCtaType?: "COPY" | "SHARE";
  onShareClick?: () => void;
  onNotifyClick?: () => void;
}

export default function ShortItem({
  type = "SHORT",
  data,
  onView,
  onLeave,
  isShareLoading,
  shareCtaType = "COPY",
  onShareClick,
  onNotifyClick,
}: ShortItemProps) {
  const [swipePrompt, setSwipePrompt] = useState<{
    location: "top" | "bottom";
    text: string;
  }>();
  const swipePromptCleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { ref } = useOnScreen<HTMLDivElement>({
    options: {
      rootMargin: "48px 0px 0px 0px",
      threshold: 0.51,
    },
    onEnter: handleOnEnter,
    onLeave(direction) {
      handleSwipePromptTimeoutCleanup();
      onLeave?.(data?.id, direction);
    },
  });

  function handleOnEnter() {
    handleSwipePrompt();
    onView?.(data?.id);
  }

  function handleSwipePrompt() {
    if (hasShortViewHistory()) return;
    setSwipePrompt({
      location: "bottom",
      text: "Swipe up to read the next R-Short",
    });

    swipePromptCleanupTimeoutRef.current = setTimeout(() => {
      setSwipePrompt(undefined);
    }, SWIPE_PROMPT_ANIMATION_DURATION_MS);
  }
  function handleSwipePromptTimeoutCleanup() {
    if (swipePromptCleanupTimeoutRef.current) {
      clearTimeout(swipePromptCleanupTimeoutRef.current);
    }
  }

  useEffect(() => {
    return handleSwipePromptTimeoutCleanup;
  }, []);

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
            <ShortMedia {...data.media} tag={data.tag} />
          )}
          {data.content && (
            <div className={styles.ShortItem__Content}>{data.content}</div>
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
          <NotifyButton onClick={onNotifyClick} />
        </>
      )}
    </SwipePrompt>
  );
}

function NotifyButton(props: { onClick?: () => void }) {
  const [isPressed, setIsPressed] = useState(false);
  function handleClick() {
    setIsPressed(true);
    props.onClick?.();
  }
  const label = isPressed ? "We will notify" : "Notify Me";
  const btnTypeClass = isPressed ? "btn-success-light" : "btn-primary";

  return (
    <button
      className={`btn ${btnTypeClass} flex-center btn-block`}
      onClick={handleClick}
      disabled={isPressed}
    >
      <BellRinging size={24} className="mr-2" />
      <span>{label}</span>
    </button>
  );
}

function ShareOrCopyButton(props: {
  isLoading?: boolean;
  type: "SHARE" | "COPY";
  onClick?: () => void;
}) {
  const { isLoading, type, onClick } = props;
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
      disabled={isLoading ?? copied}
    >
      <ShareNetwork size={24} className="mr-2" />
      <span>{label}</span>
    </button>
  );
}
