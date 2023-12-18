import { useEffect } from "react";
import styles from "./styles.module.css";

function getRootComponent(context: {
  hasUrl: boolean;
  hasOnCall: boolean;
  hasButtonInside: boolean;
}): "div" | "a" | "button" {
  const { hasUrl, hasOnCall, hasButtonInside } = context;
  if (hasUrl && hasOnCall) return "a";
  if (hasUrl) return "a";
  if (hasOnCall && !hasButtonInside) return "button";
  return "div";
}

export interface BannerProps {
  backgroundColor?: string;
  heading?: string;
  headingColor?: string;
  description?: string;
  descriptionColor?: string;
  rightImageUrl?: string;
  url?: string;
  onClick?: () => void;
  onMount?: () => void;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  ctaLabelColor?: string;
  ctaBackgroundColor?: string;
  hasHorizontalMargin?: boolean;
}

export default function Banner({
  backgroundColor,
  heading,
  headingColor,
  description,
  descriptionColor,
  rightImageUrl,
  url,
  onClick,
  onMount,
  ctaLabel,
  ctaDisabled,
  ctaLabelColor,
  ctaBackgroundColor,
  hasHorizontalMargin = false,
}: BannerProps) {
  useEffect(() => {
    onMount?.();
  }, []);
  const RootComponent = getRootComponent({
    hasUrl: !!url,
    hasOnCall: !!onClick,
    hasButtonInside: !!ctaLabel,
  });
  return (
    <RootComponent
      className={styles.Banner}
      style={{
        background: backgroundColor,
        margin: !hasHorizontalMargin ? "0px" : undefined,
      }}
      href={url}
      onClick={onClick}
      disabled={ctaDisabled}
      role="button"
    >
      <div>
        {heading && (
          <h3
            className="text-body text-semibold"
            style={{ color: headingColor }}
          >
            {heading}
          </h3>
        )}
        {description && (
          <p
            className="text-caption clr-text-secondary mt-2"
            style={{ color: descriptionColor }}
          >
            {description}
          </p>
        )}
        {ctaLabel && (
          <button
            className="btn btn-primary btn-compact mt-2"
            style={{
              color: ctaLabelColor,
              backgroundColor: ctaBackgroundColor,
            }}
            disabled={ctaDisabled}
          >
            {ctaLabel}
          </button>
        )}
      </div>
      <div>
        <img
          src={rightImageUrl}
          alt="banner-img"
          className={styles.Banner__Image}
        />
      </div>
    </RootComponent>
  );
}
