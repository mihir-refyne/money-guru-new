import { useOnScreen } from "@/hooks/useOnScreen";
import styles from "./styles.module.css";

interface YoutubePlayerProps {
  url: string;
  className?: string;
  onLoad?: () => void;
  autoplay?: boolean;
  showRelatedVideos?: boolean;
  controls?: boolean;
  disableKeyboard?: boolean;
  fullscreen?: boolean;
  loop?: boolean;
  mute?: boolean;
  modestBranding?: boolean;
  showOnlyThumbnail?: boolean;
}

export default function YoutubePlayer({
  url,
  className,
  onLoad,
  autoplay = false,
  showRelatedVideos = true,
  controls = true,
  disableKeyboard = false,
  fullscreen = true,
  loop = false,
  mute = false,
  modestBranding = false,
  showOnlyThumbnail = false,
}: YoutubePlayerProps) {
  const { ref, isOnScreen } = useOnScreen<HTMLDivElement>({
    options: { threshold: 0.6 },
  });

  const thumbnailImageUrl = getThumbnailImageUrlFromYoutubeUrl(url);
  if (showOnlyThumbnail && thumbnailImageUrl) {
    return (
      <img
        src={thumbnailImageUrl}
        alt={`Thumbnail of YouTube video ${url}`}
        loading="lazy"
        className={[styles.YoutubePlayer__Thumbnail, className].join(" ")}
      />
    );
  }

  function handleOnIframeLoad() {
    onLoad?.();
  }

  const iframeSrcUrl = new URL(
    `https://www.youtube-nocookie.com/embed/${getVideoIdFromUrl(url)}`
  );
  iframeSrcUrl.searchParams.append(
    "autoplay",
    convertBooleanToBinary(autoplay).toString()
  );
  iframeSrcUrl.searchParams.append(
    "rel",
    convertBooleanToBinary(showRelatedVideos).toString()
  );
  iframeSrcUrl.searchParams.append(
    "controls",
    convertBooleanToBinary(controls).toString()
  );
  iframeSrcUrl.searchParams.append(
    "disablekb",
    convertBooleanToBinary(disableKeyboard).toString()
  );
  iframeSrcUrl.searchParams.append(
    "fs",
    convertBooleanToBinary(fullscreen).toString()
  );
  iframeSrcUrl.searchParams.append(
    "loop",
    convertBooleanToBinary(loop).toString()
  );
  iframeSrcUrl.searchParams.append(
    "mute",
    convertBooleanToBinary(mute).toString()
  );
  iframeSrcUrl.searchParams.append(
    "modestbranding",
    convertBooleanToBinary(modestBranding).toString()
  );

  return (
    <div ref={ref} className={className}>
      {isOnScreen && (
        <iframe
          width="100%"
          height="100%"
          src={iframeSrcUrl.toString()}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          onLoad={handleOnIframeLoad}
        />
      )}
    </div>
  );
}

function getVideoIdFromUrl(url: string) {
  const videoId = url.split("v=")[1];
  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition != -1) {
    return videoId.substring(0, ampersandPosition);
  }
  return videoId;
}

function convertBooleanToBinary(value: boolean): number {
  if (value) return 1;
  return 0;
}

function getThumbnailImageUrlFromYoutubeUrl(url: string): string | null {
  const videoId = getVideoIdFromUrl(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
}
