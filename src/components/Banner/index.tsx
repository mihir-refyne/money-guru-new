import styles from "./styles.module.css";

export interface BannerProps {
  backgroundColor?: string;
  heading?: string;
  description?: string;
  rightImageUrl?: string;
  url?: string;
}

export default function Banner({
  backgroundColor,
  heading,
  description,
  rightImageUrl,
  url,
}: BannerProps) {
  const RootComponent = url ? "a" : "div";
  return (
    <RootComponent
      className={styles.Banner}
      style={{ backgroundColor }}
      href={url}
    >
      <div>
        <h3 className="text-body text-semibold">{heading}</h3>
        <p className="text-caption clr-text-secondary mt-2">{description}</p>
      </div>
      <div>
        <img src={rightImageUrl} alt="banner-img" />
      </div>
    </RootComponent>
  );
}
