import ShortItem, { ShortData } from "./ShortItem";
import ShortsContainer from "./ShortsContainer";
import { addShortView } from "@/lib/shorts";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logAnalyticsEvent } from "@/lib/analytics";

interface ShortsProps {
  items: ShortData[];
  onSwipeUp?: (id: string) => void;
  onSwipeDown?: (id: string) => void;
}

export default function Shorts({ items, onSwipeUp, onSwipeDown }: ShortsProps) {
  function handleOnView(id?: string) {
    if (id) {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.R_SHORTS_SCREEN,
        { short_id: id }
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

  function handleReactionClick(shortId: string, reaction: string) {
    logEventInMixpanel(AnalyticEvent.R_SHORTS_REACTED, {
      short_id: shortId,
      reaction,
    });
  }

  return (
    <ShortsContainer>
      {items.map((short) => (
        <ShortItem
          key={short.id}
          data={short}
          onView={handleOnView}
          onLeave={handleViewLeft}
          onReactionClick={(reaction) =>
            handleReactionClick(short.id, reaction)
          }
        />
      ))}
      <ShortItem
        type="END"
        onView={() => {
          logEventInMixpanel(AnalyticEvent.R_SHORTS_END_CONTENT);
        }}
        onNotifyClick={handleNotify}
      />
    </ShortsContainer>
  );
}
