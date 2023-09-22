import { useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";
import VirtualRewardsEventPageLayout from "./VirtualRewardsEventPageLayout";
import virtualRewardsEventThemeFooterImageUrl from "@/images/virtual-rewards-event-theme-footer.svg";
import Card from "../Card";
import VirtualRewardsEventHero from "./VirtualRewardsEventHero";
import VirtualRewardsEventStampStage, {
  Stamp,
} from "./VirtualRewardsEventStampStage";
import { StampCountPosition } from "../StampWrapper";
import { StampPodiumStageConfig } from "./VirtualRewardsEventStampStage/StampStagePodium";
import Banner, { BannerProps } from "../Banner";

interface VirtualRewardsEventEndProps {
  heroElementHeight?: string;
  heroElementText: string;
  heroElementTextColor?: string;
  heroElementIllustrationUrl?: string;
  heroBackgroundImageUrl?: string;
  heroFooterBackgroundColor?: string;
  stamps: Array<Stamp>;
  stampsCollected: number;
  stampCountBorderColor?: string;
  stampCountDisplayPosition?: StampCountPosition;
  stampPodiumStages: Array<StampPodiumStageConfig>;
  stampPodiumStageHasBottomBorder?: boolean;
  socialProofText?: string;
  banner?: Partial<BannerProps>;
  onMount?: () => void;
  onBannerClick?: () => void;
}

export default function VirtualRewardsEventEnd({
  heroElementHeight,
  heroElementText,
  heroElementTextColor,
  heroBackgroundImageUrl,
  heroElementIllustrationUrl,
  heroFooterBackgroundColor,
  stamps,
  stampsCollected,
  stampCountBorderColor,
  stampCountDisplayPosition,
  stampPodiumStages,
  stampPodiumStageHasBottomBorder,
  socialProofText,
  banner,
  onMount,
  onBannerClick,
}: VirtualRewardsEventEndProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  useEffect(() => {
    onMount?.();
  }, []);
  return (
    <VirtualRewardsEventPageLayout>
      <VirtualRewardsEventHero
        height={heroElementHeight}
        footer={
          socialProofText ? (
            <Card backgroundColor={heroFooterBackgroundColor}>
              <h4 className="text-body text-medium text-center">
                {tWithoutTypeSafety(socialProofText, { stampsCollected })}
              </h4>
            </Card>
          ) : undefined
        }
        background={
          <img
            src={heroBackgroundImageUrl}
            alt="Refyne Festival Hype Hero Background"
            height="100%"
            width="100%"
            style={{
              objectFit: "cover",
            }}
          />
        }
      >
        <h3
          className="text-heading text-semi-bold text-center"
          style={{ color: heroElementTextColor }}
        >
          {tWithoutTypeSafety(heroElementText)}
        </h3>
        <div className="flex-center" style={{ flexDirection: "column" }}>
          {heroElementIllustrationUrl && (
            <img
              src={heroElementIllustrationUrl}
              alt="Refyne Virtual Rewards Event Finish Illustration"
            />
          )}
          <VirtualRewardsEventStampStage
            stamps={stamps}
            stampCountBorderColor={stampCountBorderColor}
            stampCountDisplayPosition={stampCountDisplayPosition}
            hasBottomBorder={stampPodiumStageHasBottomBorder}
            podiumStages={stampPodiumStages}
            // onStampClick={handleStampClick}
          />
        </div>
      </VirtualRewardsEventHero>
      {banner && (
        <div className="px-4 mb-4">
          <Banner
            {...banner}
            heading={tWithoutTypeSafety(banner.heading ?? "")}
            description={tWithoutTypeSafety(banner.description ?? "")}
            ctaLabel={tWithoutTypeSafety(banner.ctaLabel ?? "")}
            onClick={onBannerClick}
          />
        </div>
      )}
      <div
        style={{
          marginBottom: "-0.8rem",
        }}
      >
        <img
          style={{
            width: "100%",
          }}
          src={virtualRewardsEventThemeFooterImageUrl.src}
          alt="Virtual Rewards Event Theme Footer"
        />
      </div>
    </VirtualRewardsEventPageLayout>
  );
}
