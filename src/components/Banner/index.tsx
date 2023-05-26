import styles from "./styles.module.css";

export interface BannerProps {
  backgroundColor?: string;
  heading?: string;
  description?: string;
  rightImageUrl?: string;
  url?: string;
  ctaLabel?: string;
}

export default function Banner({
  backgroundColor,
  heading,
  description,
  rightImageUrl,
  url,
  ctaLabel,
}: BannerProps) {
  const RootComponent = url ? "a" : "div";
  return (
    <RootComponent
      className={styles.Banner}
      style={{ backgroundColor }}
      href={url}
    >
      <div>
        {heading && <h3 className="text-body text-semibold">{heading}</h3>}
        {description && (
          <p className="text-caption clr-text-secondary mt-2">{description}</p>
        )}
        {ctaLabel && (
          <button className="btn btn-primary btn-compact mt-2">
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
