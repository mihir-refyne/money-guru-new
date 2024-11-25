import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import {
  ShortReactionMap,
  addShortView,
  getShortReactionMap,
  setShortReactionMap,
} from "@/lib/shorts";
import { ReactNode, useEffect, useRef, useState } from "react";
import ShortItem, { ShortData } from "./ShortItem";
import ShortsContainer from "./ShortsContainer";
import ShortsContainerLayoutLoader from "./ShortsContainerLayoutLoader";

export type ShortItem =
  | {
      type: "SHORT";
      data: ShortData;
    }
  | {
      type: "FILLER";
      data: ReactNode;
    };

interface ShortsProps {
  items: ShortItem[];
  onSwipeUp?: (id: string) => void;
  onSwipeDown?: (id: string) => void;
  hasEnd?: boolean;
  eventMetadata?: Record<string, string>;
  reactionElementId?: string;
}

const SYNTHETIC_LOADER_TIME_IN_MS = 2000;

export default function Shorts({
  items,
  onSwipeUp,
  onSwipeDown,
  hasEnd = false,
  eventMetadata,
  reactionElementId,
}: ShortsProps) {
  const [shortsLocalReactionMap, _setLocalShortsReactionMap] =
    useState<ShortReactionMap>(getShortReactionMap);
  const [isSyntheticLoadingCompleted, setIsSyntheticLoadingCompleted] =
    useState(false);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsSyntheticLoadingCompleted(true);
    }, SYNTHETIC_LOADER_TIME_IN_MS);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleOnView(id?: string, isContentOverflowing?: boolean) {
    if (id) {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.R_SHORTS_SCREEN,
        { short_id: id, is_truncated: isContentOverflowing, ...eventMetadata },
      );
      addShortView(id);
    }
  }

  function handleViewLeft(id?: string, direction?: string) {
    if (id && direction) {
      const eventName =
        direction === "UP"
          ? AnalyticEvent.R_SHORTS_SWIPE_DOWN
          : AnalyticEvent.R_SHORTS_SWIPE_UP;
      logEventInMixpanel(eventName, {
        short_id: id,
      });
      if (direction === "UP") {
        onSwipeDown?.(id);
      }
      if (direction === "DOWN") {
        onSwipeUp?.(id);
      }
    }
  }

  function handleNotify() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.R_SHORTS_END_CONTENT_CTA_CLICKED,
      {
        cta: "NOTIFY",
      },
    );
  }

  function handleReactionClick(shortId: string, reaction: string) {
    logEventInMixpanel(AnalyticEvent.R_SHORTS_REACTED, {
      short_id: shortId,
      reaction,
    });
    const payload = { [shortId]: reaction };
    _setLocalShortsReactionMap((prev) => ({ ...prev, ...payload }));
    setShortReactionMap(payload);
  }

  function handleReadMoreClickSideEffect(shortId: string) {
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.R_SHORTS_READ_MORE_CTA_CLICKED,
      {
        short_id: shortId,
      },
    );
  }

  return (
    <ShortsContainer>
      {!isSyntheticLoadingCompleted && <ShortsContainerLayoutLoader />}
      {items.map((short, index) => {
        if (short.type === "SHORT") {
          const _reactionElementId =
            reactionElementId && [reactionElementId, short.data.id].join("_");
          return (
            <ShortItem
              key={short.data.id}
              data={short.data}
              onView={handleOnView}
              onLeave={handleViewLeft}
              reaction={shortsLocalReactionMap[short.data.id]}
              reactionElementId={_reactionElementId}
              onReactionClick={(reaction) =>
                handleReactionClick(short.data.id, reaction)
              }
              onReadMoreClick={() =>
                handleReadMoreClickSideEffect(short.data.id)
              }
            />
          );
        }
        if (short.type === "FILLER")
          return (
            <ShortItem
              type="FILLER"
              key={index}
              onView={handleOnView}
              onLeave={handleViewLeft}
              fillerContent={short.data}
            />
          );
        return null;
      })}
      {hasEnd && (
        <ShortItem
          type="END"
          onView={() => {
            logEventInMixpanel(AnalyticEvent.R_SHORTS_END_CONTENT);
          }}
          onNotifyClick={handleNotify}
        />
      )}
    </ShortsContainer>
  );
}
