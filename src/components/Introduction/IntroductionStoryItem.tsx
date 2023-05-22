import { useEffect } from "react";
import styles from "./IntroductionStoryItem.module.css";

export interface IntroductionStoryItemProps {
  heading?: string;
  illustrationImageUrl?: string;
  footerText?: string;
  onMount?: () => void;
}

export default function IntroductionStory({
  heading,
  illustrationImageUrl,
  footerText,
  onMount,
}: IntroductionStoryItemProps) {
  useEffect(() => {
    onMount?.();
  }, []);
  return (
    <div className={styles.IntroductionStoryItem}>
      {heading && <h2 className="text-sub-title text-semibold">{heading}</h2>}
      {illustrationImageUrl && <img src={illustrationImageUrl} alt={heading} />}
      {footerText && (
        <div className={styles.IntroductionStoryItem__Footer}>
          <p className="text-caption text-regular clr-text-secondary">
            {footerText}
          </p>
        </div>
      )}
    </div>
  );
}
