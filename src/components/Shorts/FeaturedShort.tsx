import { ReactElement } from "react";
import styles from "./FeaturedShort.module.css";
import ShortMedia from "./ShortMedia";

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
        <ShortMedia type="image" url={imageUrl} tag={tag} />
      )}
      {children}
      <p className={styles.FeaturedShort__ReadMore}>Read more</p>
    </div>
  );
}
