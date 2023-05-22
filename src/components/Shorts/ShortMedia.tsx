import React from "react";
import YoutubePlayer from "../YoutubePlayer";
import styles from "./ShortMedia.module.css";

interface ShortMediaProps {
  type: "image" | "video";
  url: string;
  tag?: string;
  showOnlyThumbnailForVideo?: boolean;
}

export default function ShortMedia({
  type,
  url,
  tag,
  showOnlyThumbnailForVideo = false,
}: ShortMediaProps) {
  if (type === "image") {
    return (
      <figure className={styles.ShortMedia__Image__Wrapper}>
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
      <div className={styles.ShortMedia__Image__Wrapper}>
        {tag && <span className={styles.ShortMedia__Tag}>{tag}</span>}
        <YoutubePlayer
          className={styles.ShortMedia__Image}
          url={url}
          autoplay
          fullscreen={false}
          modestBranding
          showRelatedVideos={false}
          loop
          controls={false}
          showOnlyThumbnail={showOnlyThumbnailForVideo}
        />
      </div>
    );
  }
  return null;
}
