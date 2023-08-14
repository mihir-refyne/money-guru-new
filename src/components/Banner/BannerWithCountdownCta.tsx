import useCountdown from "@/hooks/useCountdown";
import Banner, { BannerProps } from ".";
import { durationInSecondsToMinSec } from "@/lib/utils";

export interface BannerWithCountdownCtaProps extends BannerProps {
  countdownForInSec: number;
  ctaLabelAfterCountdownFinished?: string;
  ctaDisabledTillCountdownFinish?: boolean;
  onCountdownExpiry?: () => void;
}

export default function BannerWithCountdownCta({
  countdownForInSec,
  ctaLabel,
  ctaDisabled,
  ctaLabelAfterCountdownFinished,
  ctaDisabledTillCountdownFinish,
  onCountdownExpiry,
  ...restProps
}: BannerWithCountdownCtaProps) {
  const { remainingCount } = useCountdown({
    countForInSec: countdownForInSec,
    onExpiry: onCountdownExpiry,
  });
  const countdownFinished = remainingCount <= 0;
  const { minutes, seconds } = durationInSecondsToMinSec(remainingCount);
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");
  const formattedCtaLabel = [ctaLabel, `${paddedMinutes}:${paddedSeconds}`]
    .filter(Boolean)
    .join(" ");
  const label =
    countdownFinished && ctaLabelAfterCountdownFinished
      ? ctaLabelAfterCountdownFinished
      : formattedCtaLabel;
  const _ctaDisabled = ctaDisabledTillCountdownFinish
    ? !countdownFinished
    : ctaDisabled;

  return <Banner {...restProps} ctaLabel={label} ctaDisabled={_ctaDisabled} />;
}
