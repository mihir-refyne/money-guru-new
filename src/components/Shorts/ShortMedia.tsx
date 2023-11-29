import React from "react";
import YoutubePlayer from "../YoutubePlayer";
import styles from "./ShortMedia.module.css";

interface ShortMediaProps {
  type: "image" | "video";
  url: string;
  fullHeight?: boolean;
  tag?: string;
  showOnlyThumbnailForVideo?: boolean;
  hideIfNotInView?: boolean;
  autoplay?: boolean;
  controls?: boolean;
}

export default function ShortMedia({
  type,
  url,
  fullHeight = false,
  tag,
  showOnlyThumbnailForVideo = false,
  hideIfNotInView,
  autoplay = true,
  controls = false,
}: ShortMediaProps) {
  if (type === "image") {
    return (
      <figure
        className={`${styles.ShortMedia__Image__Wrapper} ${
          fullHeight ? styles.FullHeight : ""
        }`}
      >
        {tag && <span className={styles.ShortMedia__Tag}>{tag}</span>}
        <img
          src={url}
          alt={tag ?? "Short Image"}
          className={styles.ShortMedia__Image}
          loading="lazy"
        />
      </figure>
    );
  }
  if (type === "video") {
    return (
      <div
        className={`${styles.ShortMedia__Image__Wrapper} ${
          fullHeight ? styles.FullHeight : ""
        }`}
      >
        {tag && <span className={styles.ShortMedia__Tag}>{tag}</span>}
        <YoutubePlayer
          className={styles.ShortMedia__Image}
          url={url}
          autoplay={autoplay}
          fullscreen={false}
          modestBranding
          showRelatedVideos={false}
          loop
          controls={controls}
          showOnlyThumbnail={showOnlyThumbnailForVideo}
          hideIfNotInView={hideIfNotInView}
        />
      </div>
    );
  }
  return null;
}
