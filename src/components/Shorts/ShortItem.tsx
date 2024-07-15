import { useOnScreen } from "@/hooks/useOnScreen";
import {
  BellRinging,
  ShareNetwork,
  ThumbsDown,
  ThumbsUp,
} from "phosphor-react";
import { ReactNode, forwardRef, useEffect, useRef, useState } from "react";
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
import { useIsOverflowing } from "@/hooks/useIsOverflowing";
import format from "date-fns/format";

const SWIPE_PROMPT_ANIMATION_DURATION_MS = 3 * 1000;
const TRUNCATE_RESET_DELAY_MS = 0.5 * 1000;
const DEFERRED_ON_VIEW_TRIGGER_DELAY_MS = 500;

const DEFAULT_R_SHORT_SHARE_PAYLOAD = {
  text: "Stay updated, stay sharp! Dive into today's R-short.\n \n",
  url: "https://refyne.page.link/mg-share",
  imageUrl: "",
};

export interface ShortData {
  id: string;
  media?: {
    type: "image";
    url: string;
    fullHeight?: boolean;
  };
  tag?: string;
  content?: ReactNode;
  contentTitle?: string;
  publishedAt?: Date;
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
  fillerContent?: ReactNode;
  onView?: (id?: string, isContentOverflowing?: boolean) => void;
  onLeave?: (id?: string, direction?: string) => void;
  onNotifyClick?: () => void;
  reactionElementId?: string;
  reaction?: string;
  onReactionClick?: (reaction: "LIKED" | "DISLIKED") => void;
  onShareClick?: (id?: string) => void;
  onReadMoreClick?: () => void;
}

export default function ShortItem({
  type = "SHORT",
  data,
  fillerContent,
  onView,
  onLeave,
  onNotifyClick,
  reactionElementId,
  reaction,
  onReactionClick,
  onShareClick,
  onReadMoreClick,
}: ShortItemProps) {
  const { t } = useTranslation("common");
  const [swipePrompt, setSwipePrompt] = useState<{
    location: "top" | "bottom";
    text: string;
  }>();
  const [isTruncated, setIsTruncated] = useState(true);
  const isContentOverflowingRef = useRef<boolean | null>(null);
  const swipePromptCleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTruncateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deferredOnViewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
      resetTruncationWithDelay();
      onLeave?.(data?.id, direction);
    },
  });

  function handleOnEnter() {
    handleSwipePrompt();
    handleOnViewWithDeferred();
  }

  function handleOnViewWithDeferred() {
    const deferred = isContentOverflowingRef.current === null;
    if (deferred) {
      deferredOnViewTimeoutRef.current = setTimeout(
        handleOnView,
        DEFERRED_ON_VIEW_TRIGGER_DELAY_MS
      );
      return;
    }
    handleOnView();
  }

  function handleOnView() {
    onView?.(data?.id, !!isContentOverflowingRef.current);
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

  function handleReadMoreClick() {
    setIsTruncated(false);
    onReadMoreClick?.();
  }
  function resetTruncationWithDelay() {
    resetTruncateTimeoutRef.current = setTimeout(() => {
      setIsTruncated(true);
    }, TRUNCATE_RESET_DELAY_MS);
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

  function handleContentOverflowChange(overflowing: boolean) {
    isContentOverflowingRef.current = overflowing;
  }

  function handleScreenshotCaptureAndShare(dataUri?: string) {
    const _sharePayload = {
      ...DEFAULT_R_SHORT_SHARE_PAYLOAD,
      imageUrl: dataUri,
    };
    const updatedText = [data?.contentTitle, _sharePayload.text]
      .filter(Boolean)
      .join("\n\n");
    const sharePayload = {
      text: updatedText,
      url: _sharePayload.url,
      imageUrls: _sharePayload.imageUrl ? [_sharePayload.imageUrl] : [],
    };
    shareOrClipboardCopy(sharePayload, { showToastOnClipboardCopy: true });
  }

  useEffect(() => {
    return () => {
      handleSwipePromptTimeoutCleanup();
      if (resetTruncateTimeoutRef.current) {
        clearTimeout(resetTruncateTimeoutRef.current);
      }
      if (deferredOnViewTimeoutRef.current) {
        clearTimeout(deferredOnViewTimeoutRef.current);
      }
    };
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
        <ShortItemContent
          ref={shareElementRef}
          data={data}
          reaction={reaction}
          reactionElementId={reactionElementId}
          isTruncated={isTruncated}
          onReactionClick={onReactionClick}
          shareLoading={shareInProgress || screenshotCaptureState.isLoading}
          onShareClick={handleShareClick}
          readMoreCtaLabel={t("read_more")}
          onReadMoreClick={handleReadMoreClick}
          onContentOverflowChange={handleContentOverflowChange}
        />
      )}
      {type === "FILLER" && fillerContent}
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

function getLineNumberPostTextToBeTruncated(viewHeightInPx: number): number {
  if (viewHeightInPx < 600) return 6;
  if (viewHeightInPx < 700) return 8;
  if (viewHeightInPx < 750) return 9;
  if (viewHeightInPx < 800) return 10;
  if (viewHeightInPx < 850) return 11;
  if (viewHeightInPx < 900) return 14;
  if (viewHeightInPx < 950) return 16;
  if (viewHeightInPx < 1000) return 17;
  if (viewHeightInPx < 1050) return 18;
  return 20;
}

const ShortItemContent = forwardRef<
  HTMLDivElement,
  {
    data: ShortData;
    reaction?: string;
    reactionElementId?: string;
    onReactionClick?: (reaction: "LIKED" | "DISLIKED") => void;
    shareLoading: boolean;
    onShareClick?: () => void;
    isTruncated?: boolean;
    readMoreCtaLabel?: string;
    onReadMoreClick?: () => void;
    onContentOverflowChange?: (overflowing: boolean) => void;
  }
>(function ShortItemContent(props, ref) {
  const {
    data,
    reaction,
    reactionElementId,
    onReactionClick,
    shareLoading,
    onShareClick,
    isTruncated,
    readMoreCtaLabel,
    onReadMoreClick,
    onContentOverflowChange,
  } = props;
  const isMediaFullHeight = data.media?.fullHeight ?? false;
  const { ref: contentElemRef, isOverflowing: isContentOverflowing } =
    useIsOverflowing<HTMLDivElement>({
      dependencies: [data.content, isTruncated],
    });
  const [lineClampCount, setLineClampCount] = useState<number>();

  useEffect(() => {
    if (isContentOverflowing === null) return;
    onContentOverflowChange?.(isContentOverflowing);
  }, [isContentOverflowing]);

  useEffect(() => {
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    setLineClampCount(getLineNumberPostTextToBeTruncated(viewportHeight));
  }, [contentElemRef]);

  const isContentOverflowDetectionLoading = isContentOverflowing === null;
  /*
  - fullHeight media will take full height space
  - content and fotter will be floating above them with transparent backgrounf
  */
  return (
    <>
      <div
        className={`${styles.ShortItem__Body} ${
          isMediaFullHeight ? styles.FullHeight : ""
        }`}
        ref={ref}
        style={
          {
            "--line-clamp-count": lineClampCount,
          } as React.CSSProperties
        }
      >
        {data.media && <ShortMedia {...data.media} autoplay tag={data.tag} />}
        {/* TODO: Check what to do with content */}
        {!isMediaFullHeight && data.content && (
          <div
            ref={contentElemRef}
            className={`${styles.ShortItem__Content} ${
              isTruncated ? styles.Truncated : ""
            } ${isContentOverflowDetectionLoading ? styles.Loading : ""}`}
          >
            {data.content}
            {data.publishedAt && (
              <p className={styles.ShortItem__Content__Date}>
                {format(data.publishedAt, "dd MMM yyyy")}
              </p>
            )}
          </div>
        )}
        {isContentOverflowing && isTruncated && (
          <button
            className="text-semibold clr-brand-default mt-2"
            onClick={onReadMoreClick}
          >
            {readMoreCtaLabel}
          </button>
        )}
        <div className={styles.ShortItem__Footer}>
          <ShortItemReaction
            id={reactionElementId}
            reaction={reaction}
            reactionCount={data.reaction}
            onReactionClick={onReactionClick}
          />
          <button
            className="btn flex-center"
            disabled={shareLoading}
            onClick={onShareClick}
          >
            <span className="text-body text-medium mr-1">Share</span>
            <ShareNetwork size={24} />
          </button>
        </div>
      </div>
    </>
  );
});

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
  id?: string;
  reaction?: string;
  reactionCount?: { liked: number };
  onReactionClick?: (reaction: "LIKED" | "DISLIKED") => void;
}) {
  const { id, reaction, reactionCount, onReactionClick } = props;

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
      id={id}
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
