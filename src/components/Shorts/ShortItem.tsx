import { useOnScreen } from "@/hooks/useOnScreen";
import {
  BellRinging,
  ShareNetwork,
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
import { useToJpeg } from "@hugocxl/react-to-image";
import { useShare } from "@/hooks/useShare";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import useTranslation from "@/hooks/useTranslation";
import { isIOS } from "@/lib/utils";

const SWIPE_PROMPT_ANIMATION_DURATION_MS = 3 * 1000;

const DEFAULT_R_SHORT_SHARE_PAYLOAD = {
  text: "Stay updated, stay sharp! Dive into today's R-short.",
  url: "https://refyne.page.link/install",
  imageUrl: "",
};

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
  reaction: {
    liked: number;
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
  reaction?: string;
  onReactionClick?: (reaction: "LIKED" | "DISLIKED") => void;
  onShareClick?: (id?: string) => void;
}

export default function ShortItem({
  type = "SHORT",
  data,
  onView,
  onLeave,
  onNotifyClick,
  reaction,
  onReactionClick,
  onShareClick,
}: ShortItemProps) {
  const { t } = useTranslation("common");
  const [swipePrompt, setSwipePrompt] = useState<{
    location: "top" | "bottom";
    text: string;
  }>();
  const swipePromptCleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const { shareInProgress, shareOrClipboardCopy } = useShare({
    isNativePlatformShareSupported:
      isCurrentlyOnRefyneWebview(appPlatformName) && !isIOS(),
  });
  const [
    screenshotCaptureState,
    captureScreenshotAndTransformToDataUri,
    shareElementRef,
  ] = useToJpeg<HTMLDivElement>({
    backgroundColor: "#ffffff",
    quality: 0.7,
    onSuccess: handleScreenshotCaptureAndShare,
    onError: handleScreenshotCaptureError,
    filter(domNode) {
      if (domNode.tagName === "DIV") {
        for (let i = 0; i <= domNode.children.length; i++) {
          const item = domNode.children?.item(i);
          if (item?.tagName === "DIV") {
            if (item.children.item(0)?.tagName === "IFRAME") return false;
          }
        }
      }
      return true;
    },
  });
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

  function handleShareClick() {
    onShareClick?.(data?.id);
    if (isIOS()) {
      return handleScreenshotCaptureError();
    }
    captureScreenshotAndTransformToDataUri();
  }

  function handleScreenshotCaptureError() {
    const fallbackImageUrl =
      data?.media?.type === "image" ? data.media.url : undefined;
    handleScreenshotCaptureAndShare(fallbackImageUrl);
  }

  function handleScreenshotCaptureAndShare(dataUri?: string) {
    const _sharePayload = {
      ...DEFAULT_R_SHORT_SHARE_PAYLOAD,
      imageUrl: dataUri,
    };
    const sharePayload = {
      text: _sharePayload.text,
      url: _sharePayload.url,
      imageUrls: _sharePayload.imageUrl ? [_sharePayload.imageUrl] : [],
    };
    shareOrClipboardCopy(sharePayload, { showToastOnClipboardCopy: true });
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
          <div className={styles.ShortItem__Body} ref={shareElementRef}>
            {data.media && <ShortMedia {...data.media} tag={data.tag} />}
            {data.content && (
              <div className={styles.ShortItem__Content}>{data.content}</div>
            )}
          </div>
          <div className={styles.ShortItem__Footer}>
            <ShortItemReaction
              reaction={reaction}
              reactionCount={data.reaction}
              onReactionClick={onReactionClick}
            />
            <button
              className="btn flex-center"
              disabled={shareInProgress || screenshotCaptureState.isLoading}
              onClick={handleShareClick}
            >
              <span className="text-body text-medium mr-1">Share</span>
              <ShareNetwork size={24} />
            </button>
          </div>
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
          <div className="p-4" style={{ width: "100%" }}>
            <NotifyButton onClick={onNotifyClick} />
          </div>
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
  reaction?: string;
  reactionCount?: { liked: number };
  onReactionClick?: (reaction: "LIKED" | "DISLIKED") => void;
}) {
  const { reaction, reactionCount, onReactionClick } = props;

  const isLiked = reaction === "LIKED";
  const isDisliked = reaction === "DISLIKED";

  const likeCountToBeIncreasedBy = isLiked ? 1 : 0;
  const likedCount = (reactionCount?.liked ?? 0) + likeCountToBeIncreasedBy;

  function setReaction(reaction: "LIKED" | "DISLIKED") {
    return () => {
      if (reaction === "LIKED" && isLiked) return;
      if (reaction === "DISLIKED" && isDisliked) return;
      onReactionClick?.(reaction);
    };
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <button className="btn btn-only-icon" onClick={setReaction("LIKED")}>
        <ThumbsUp
          className="mt-0"
          size={24}
          weight={isLiked ? "fill" : "regular"}
        />
      </button>
      {likedCount > 0 && (
        <p className="text-body text-medium clr-text-primary mr-2">
          {likedCount}
        </p>
      )}
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
