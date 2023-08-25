import { useOnScreen } from "@/hooks/useOnScreen";
import {
  BellRinging,
  ThumbsDown,
  ThumbsUp,
} from "phosphor-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import SwipePrompt from "../SwipePrompt";
import ShortMedia from "./ShortMedia";
import styles from "./ShortItem.module.css";
import emptyBoxIllustrationUrl from "@/images/empty-box-illustration.svg";
import Image from "next/image";
import { hasShortViewHistory } from "@/lib/shorts";
import useTranslation from "@/hooks/useTranslation";

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
  onNotifyClick?: () => void;
  onReactionClick?: (reaction: "LIKED" | "DISLIKED") => void;
}

export default function ShortItem({
  type = "SHORT",
  data,
  onView,
  onLeave,
  onNotifyClick,
  onReactionClick,
}: ShortItemProps) {
  const { t } = useTranslation("common");
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
      text: t("swipe_up_read_next_short"),
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
          {data.media && <ShortMedia {...data.media} tag={data.tag} />}
          {data.content && (
            <div className={styles.ShortItem__Content}>
              {data.content}
              <ShortItemReaction onReactionClick={onReactionClick} />
            </div>
          )}
        </>
      )}
      {/* TODO: Filler */}
      {type === "END" && (
        <>
          <div className={styles.ShortItem__End__Content}>
            <Image src={emptyBoxIllustrationUrl} alt="ill" />
            <h3 className="text-sub-title mt-4">{t("well_done")}</h3>
            <p className="text-heading clr-text-secondary text-center mt-4">
              {t("finished_all_shorts_will_add_more")}
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

function ShortItemReaction(props: {
  onReactionClick?: (reaction: "LIKED" | "DISLIKED") => void;
}) {
  const [{ isLiked, isDisliked }, _setReaction] = useState<{
    isLiked: boolean;
    isDisliked: boolean;
  }>({ isLiked: false, isDisliked: false });

  function setReaction(reaction: "LIKED" | "DISLIKED") {
    return () => {
      if (reaction === "LIKED") {
        _setReaction({ isLiked: true, isDisliked: false });
      } else if (reaction === "DISLIKED") {
        _setReaction({ isDisliked: true, isLiked: false });
      }
      props.onReactionClick?.(reaction);
    };
  }

  return (
    <div
      className="border-top-dashed mt-4 pt-3"
      style={{
        display: "flex",
      }}
    >
      <button className="btn btn-only-icon" onClick={setReaction("LIKED")}>
        <ThumbsUp
          className="mt-0"
          size={24}
          weight={isLiked ? "fill" : "regular"}
        />
      </button>
      <button className="btn btn-only-icon" onClick={setReaction("DISLIKED")}>
        <ThumbsDown
          className="mt-0"
          size={24}
          weight={isDisliked ? "fill" : "regular"}
        />
      </button>
    </div>
  );
}
