import { copyText } from "@/lib/clipboard";
import {
  canShareImage,
  isWebShareApiSupported,
  share,
  shareToNativePlatformWithImageUrls,
  shareWithImageUrls,
} from "@/lib/share";
import React, { useEffect, useState } from "react";
import ShortItem, { ShortData } from "./ShortItem";
import ShortsContainer from "./ShortsContainer";
import { addShortView } from "@/lib/shorts";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInWebengage } from "@/lib/analytics/webengage";

interface ShortsProps {
  items: ShortData[];
}

export default function Shorts({ items }: ShortsProps) {
  const [canShareViaWebApi, setCanShareViaWebApi] = useState(false);
  const [isSharePromptActive, setIsSharePromptActive] = useState(false);
  const isRefyneWebviewWithShareSupported = isCurrentlyOnRefyneWebview(
    getValueFromMetadata("appPlatformName")
  );

  const shareCtaType =
    canShareViaWebApi || isRefyneWebviewWithShareSupported ? "SHARE" : "COPY";

  useEffect(() => {
    // Had to do this due to next js error.
    setCanShareViaWebApi(isWebShareApiSupported());
  }, []);

  function handleOnView(id?: string) {
    if (id) {
      logEventInMixpanel(AnalyticEvent.R_SHORTS_SCREEN, { short_id: id });
      addShortView(id);
    }
  }

  function handleViewLeft(id?: string, direction?: string) {
    if (id && direction) {
      const eventName =
        direction === "UP"
          ? AnalyticEvent.R_SHORTS_SWIPE_UP
          : AnalyticEvent.R_SHORTS_SWIPE_DOWN;
      logEventInMixpanel(eventName, {
        short_id: id,
      });
    }
  }

  function handleShareClick(sharePayload?: {
    imageUrl?: string | undefined;
    url?: string | undefined;
    text: string;
  }) {
    if (!sharePayload) return;
    const { imageUrl, text, url } = sharePayload;
    return async () => {
      logEventInMixpanel(AnalyticEvent.R_SHORTS_SHARED);
      setIsSharePromptActive(true);
      try {
        if (canShareViaWebApi) {
          if (canShareImage() && imageUrl) {
            await shareWithImageUrls({
              imageUrls: [imageUrl],
              text,
              url,
            });
          } else {
            await share({
              text,
              url,
            });
          }
        } else if (isRefyneWebviewWithShareSupported) {
          await shareToNativePlatformWithImageUrls({
            ...(imageUrl ? { imageUrls: [imageUrl] } : {}),
            text,
            url,
          });
        } else if (url) {
          copyText(url);
        } else {
          copyText(text);
        }
      } catch (_) {
        copyText(text);
      } finally {
        setIsSharePromptActive(false);
      }
    };
  }

  function handleNotify() {
    logEventInMixpanel(AnalyticEvent.R_SHORTS_END_CONTENT_CTA_CLICKED);
    logEventInWebengage(AnalyticEvent.NEW_CONTENT_NOTIFY_REQUEST_CLICK);
  }

  return (
    <ShortsContainer>
      {items.map((short) => (
        <ShortItem
          key={short.id}
          data={short}
          isShareLoading={isSharePromptActive}
          shareCtaType={shareCtaType}
          onShareClick={handleShareClick(short.share)}
          onView={handleOnView}
          onLeave={handleViewLeft}
          onNotifyClick={handleNotify}
        />
      ))}
      <ShortItem
        type="END"
        onView={() => {
          logEventInMixpanel(AnalyticEvent.R_SHORTS_END_CONTENT);
        }}
      />
    </ShortsContainer>
  );
}
