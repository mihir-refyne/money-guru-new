import { ReactElement } from "react";
import styles from "./FeaturedShort.module.css";

interface FeaturedShortProps {
  imageUrl?: string;
  tag?: string;
  children?: ReactElement;
  onClick?: () => void;
}

export default function FeaturedShort({
  imageUrl,
  tag,
  children,
  onClick,
}: FeaturedShortProps) {
  return (
    <div className={styles.FeaturedShort} role="button" onClick={onClick}>
      {imageUrl && (
        <figure className={styles.FeaturedShort__Image__Wrapper}>
          <span className={styles.FeaturedShort__Tag}>{tag}</span>
          <img
            src={imageUrl}
            alt="content"
            className={styles.FeaturedShort__Image}
          />
        </figure>
      )}
      {children}
      <p className={styles.FeaturedShort__ReadMore}>Read more</p>
    </div>
  );
}
