import { ReactNode, useState } from "react";
import ShortItem, { ShortData } from "./ShortItem";
import ShortsContainer from "./ShortsContainer";
import {
  ShortReactionMap,
  addShortView,
  getShortReactionMap,
  setShortReactionMap,
} from "@/lib/shorts";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logAnalyticsEvent } from "@/lib/analytics";

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
}

export default function Shorts({
  items,
  onSwipeUp,
  onSwipeDown,
  hasEnd = false,
  eventMetadata,
}: ShortsProps) {
  const [shortsLocalReactionMap, _setLocalShortsReactionMap] =
    useState<ShortReactionMap>(getShortReactionMap);

  function handleOnView(id?: string) {
    if (id) {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.R_SHORTS_SCREEN,
        { short_id: id, ...eventMetadata }
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
      }
    );
  }

  function handleShareClickSideEffect(id?: string) {
    logAnalyticsEvent(["mixpanel"], AnalyticEvent.MONEY_GURU_SHARE_CLICKED, {
      tool_name: "SHORTS",
      identifier: id,
    });
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

  return (
    <ShortsContainer>
      {items.map((short, index) => {
        if (short.type === "SHORT")
          return (
            <ShortItem
              key={short.data.id}
              data={short.data}
              onView={handleOnView}
              onLeave={handleViewLeft}
              reaction={shortsLocalReactionMap[short.data.id]}
              onReactionClick={(reaction) =>
                handleReactionClick(short.data.id, reaction)
              }
              onShareClick={handleShareClickSideEffect}
            />
          );
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
