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

interface ShortsProps {
  items: ShortData[];
}

export default function Shorts({ items }: ShortsProps) {
  const [canShareViaWebApi, setCanShareViaWebApi] = useState(false);
  // TODO: Update this
  const isRefyneWebviewWithShareSupported = false;

  const shareCtaType =
    canShareViaWebApi || isRefyneWebviewWithShareSupported ? "SHARE" : "COPY";

  useEffect(() => {
    // Had to do this due to next js error.
    setCanShareViaWebApi(isWebShareApiSupported());
  }, []);

  function handleShareClick(sharePayload?: {
    imageUrl?: string | undefined;
    url?: string | undefined;
    text: string;
  }) {
    if (!sharePayload) return;
    const { imageUrl, text, url } = sharePayload;
    return () => {
      if (canShareViaWebApi) {
        if (canShareImage() && imageUrl) {
          shareWithImageUrls({
            imageUrls: [imageUrl],
            text,
            url,
          });
        } else {
          share({
            text,
            url,
          });
        }
      } else if (isRefyneWebviewWithShareSupported) {
        shareToNativePlatformWithImageUrls({
          ...(imageUrl ? { imageUrls: [imageUrl] } : {}),
          text,
          url,
        });
      } else if (url) {
        copyText(url);
      } else {
        copyText(text);
      }
    };
  }

  return (
    <ShortsContainer>
      {items.map((short) => (
        <ShortItem
          key={short.id}
          data={short}
          shareCtaType={shareCtaType}
          onShareClick={handleShareClick(short.share)}
        />
      ))}
      <ShortItem type="END" />
    </ShortsContainer>
  );
}
