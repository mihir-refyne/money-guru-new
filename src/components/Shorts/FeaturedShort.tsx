import { ReactElement } from "react";
import styles from "./FeaturedShort.module.css";
import ShortMedia from "./ShortMedia";

interface FeaturedShortProps {
  mediaType?: string;
  mediaUrl?: string;
  tag?: string;
  children?: ReactElement;
  onClick?: () => void;
}

export default function FeaturedShort({
  mediaType,
  mediaUrl,
  tag,
  children,
  onClick,
}: FeaturedShortProps) {
  return (
    <div className={styles.FeaturedShort} role="button" onClick={onClick}>
      {mediaUrl && (
        <ShortMedia type={mediaType as any} url={mediaUrl} tag={tag} />
      )}
      {children}
      <p className={styles.FeaturedShort__ReadMore}>Read more</p>
    </div>
  );
}
