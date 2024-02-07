import { useEffect } from "react";
import styles from "./IntroductionStoryItem.module.css";

export type IntroStoryFooterCta = {
  text: string;
  onClick: () => void;
};

export interface IntroductionStoryItemProps {
  heading?: string;
  illustrationImageUrl?: string;
  footerText?: string;
  onMount?: () => void;
  footerCta?: IntroStoryFooterCta;
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

  const isFooterElementAvailable = footerCta || footerText;
  return (
    <div className={styles.IntroductionStoryItem}>
      {heading && <h2 className="text-sub-title text-semibold">{heading}</h2>}
      {illustrationImageUrl && <img src={illustrationImageUrl} alt={heading} />}
      {isFooterElementAvailable && (
        <div className={styles.IntroductionStoryItem__Footer__Wrapper}>
          {footerText && (
            <div className={styles.IntroductionStoryItem__Footer}>
              <p className="text-caption text-regular clr-text-secondary">
                {footerText}
              </p>
            </div>
          )}
          {footerCta && (
            <footer className="text-center">
              <button
                className="btn btn-primary btn-block"
                onClick={footerCta.onClick}
              >
                {footerCta.text}
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}
