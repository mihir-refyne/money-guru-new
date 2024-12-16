import React, { useEffect } from "react";
import YoutubePlayer from "../YoutubePlayer";
import styles from "./VideoFillerBanner.module.css";

interface VideoFillerBannerProps {
  id?: string;
  videoUrl: string;
  autoPlayable?: boolean;
  onMount?: () => void;
}

export default function VideoFillerBanner({
  id,
  videoUrl,
  autoPlayable,
  onMount,
}: VideoFillerBannerProps) {
  useEffect(() => {
    onMount?.();
  }, []);

  return (
    <div id={id} className={styles.Video_Player_wrapper}>
      <YoutubePlayer
        hideIfNotInView={false}
        fullscreen={false}
        modestBranding
        showRelatedVideos={false}
        loop
        controls={true}
        showOnlyThumbnail={false}
        url={videoUrl}
        autoplay={autoPlayable}
        className={styles.Video_Player}
      />
    </div>
  );
}
