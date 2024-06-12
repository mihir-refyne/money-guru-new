import styles from "./FeaturedShort.module.css";
import YoutubePlayer from "../YoutubePlayer";
import useTranslation from "next-translate/useTranslation";
import { PlayCircle } from "phosphor-react";
import { getHeadingFromMarkupContent } from "@/lib/utils";
import { sanitize } from "dompurify";

interface FeaturedShortProps {
  mediaType?: string;
  thumbnailUrl?: string | null;
  mediaUrl?: string;
  content?: string;
  onClick?: () => void;
}

export default function FeaturedShort({
  mediaType,
  mediaUrl,
  content,
  onClick,
  thumbnailUrl,
}: FeaturedShortProps) {
  const { t } = useTranslation();

  const ctaLabel =
    mediaType === "image"
      ? t("read_more")
      : t("mongu_featured_video_short_cta_text");

  const ctaIcon =
    mediaType === "video" ? (
      <PlayCircle weight="fill" color="var(--clr-pure-white)" size={16} />
    ) : null;

  return (
    <div role="button" onClick={onClick}>
      {mediaUrl && (
        <FeaturedShortMedia
          type={mediaType as any}
          thumbnailUrl={thumbnailUrl}
          url={mediaUrl}
          showOnlyThumbnailForVideo
        />
      )}
      <div className={styles.FeaturedShort__ShortMedia__Footer}>
        <h3 className={styles.FeaturedShort__ShortMedia__Footer__Text}>
          {content && (
            <article className=" text-body text-semibold">
              <h3
                className={styles.FeaturedShort__ShortMedia__Footer__Text}
                dangerouslySetInnerHTML={{
                  __html: sanitize(getHeadingFromMarkupContent(content).text),
                }}
              />
            </article>
          )}
        </h3>
        <button
          className={`btn ${styles.FeaturedShort__ShortMedia__Footer__Button} text-caption `}
        >
          {ctaIcon}
          {ctaLabel}
        </button>
      </div>
      <div></div>
    </div>
  );
}

interface FeaturedShortMediaProps {
  type: "image" | "video";
  url: string;
  fullHeight?: boolean;
  showOnlyThumbnailForVideo?: boolean;
  hideIfNotInView?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  thumbnailUrl?: string | null;
}

function FeaturedShortMedia({
  type,
  url,
  autoplay,
  controls,
  showOnlyThumbnailForVideo,
  hideIfNotInView,
  thumbnailUrl,
}: FeaturedShortMediaProps) {
  if (type === "image") {
    return (
      <figure className={styles.ShortMedia__Image__Wrapper}>
        <img
          className={styles.ShortMedia__Image__Wrapper_Img}
          src={thumbnailUrl ?? url}
          alt="Short Image"
          loading="lazy"
        />
      </figure>
    );
  }
  if (type === "video") {
    return (
      <div className={styles.ShortMedia__Image__Wrapper}>
        <YoutubePlayer
          className={styles.ShortMedia__Image__Wrapper_Img}
          url={url}
          autoplay={autoplay}
          fullscreen={false}
          modestBranding
          showRelatedVideos={false}
          loop
          controls={controls}
          showOnlyThumbnail={showOnlyThumbnailForVideo}
          hideIfNotInView={hideIfNotInView}
          thumbnailImageUrl={thumbnailUrl}
        />
      </div>
    );
  }
  return null;
}
