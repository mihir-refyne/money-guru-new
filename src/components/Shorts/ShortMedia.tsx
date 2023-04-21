import React from "react";
import styles from "./ShortMedia.module.css";

interface ShortMediaProps {
  type: "image";
  url: string;
  tag?: string;
}

export default function ShortMedia({ type, url, tag }: ShortMediaProps) {
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
  return null;
}
