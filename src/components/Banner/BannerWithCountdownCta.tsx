import useCountdown from "@/hooks/useCountdown";
import Banner, { BannerProps } from ".";
import { durationInSecondsToMinSec } from "@/lib/utils";

export interface BannerWithCountdownCtaProps extends BannerProps {
  countdownForInSec: number;
}

export default function BannerWithCountdownCta({
  countdownForInSec,
  ctaLabel,
  ...restProps
}: BannerWithCountdownCtaProps) {
  const { remainingCount } = useCountdown({ countForInSec: countdownForInSec });
  const { minutes, seconds } = durationInSecondsToMinSec(remainingCount);
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");
  const formattedCtaLabel = [ctaLabel, `${paddedMinutes}:${paddedSeconds}`]
    .filter(Boolean)
    .join(" ");

  return <Banner {...restProps} ctaLabel={formattedCtaLabel} />;
}
