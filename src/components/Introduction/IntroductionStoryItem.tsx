import { useEffect } from "react";
import styles from "./IntroductionStoryItem.module.css";

export type StoryFooterSolidCta = {
  text: string;
  onClick: () => void;
};

export interface IntroductionStoryItemProps {
  heading?: string;
  illustrationImageUrl?: string;
  footerText?: string;
  onMount?: () => void;
  footerCta?: StoryFooterSolidCta;
}

export default function IntroductionStory({
  heading,
  illustrationImageUrl,
  footerText,
  onMount,
  footerCta,
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
      {footerCta && (
        <footer
          style={{ zIndex: 9999 }}
          className={`my-2 text-center ${!footerText ? "mt-20" : ""}`}
        >
          <button
            className="btn btn-primary btn-block"
            onClick={footerCta.onClick}
          >
            {footerCta.text}
          </button>
        </footer>
      )}
    </div>
  );
}
