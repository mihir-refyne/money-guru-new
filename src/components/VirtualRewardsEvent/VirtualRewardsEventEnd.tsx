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
  heroElementTextColor?: string;
  heroBackgroundImageUrl?: string;
  heroFooterBackgroundColor?: string;
  stamps: Array<Stamp>;
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
  heroElementTextColor,
  heroBackgroundImageUrl,
  heroFooterBackgroundColor,
  stamps,
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
                {tWithoutTypeSafety(socialProofText)}
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
          {/* TODO" Update with Thank you for playing Refyne Marathon  */}
          {t("stamps_page_heading")}
        </h3>
        <VirtualRewardsEventStampStage
          stamps={stamps}
          stampCountBorderColor={stampCountBorderColor}
          stampCountDisplayPosition={stampCountDisplayPosition}
          hasBottomBorder={stampPodiumStageHasBottomBorder}
          podiumStages={stampPodiumStages}
          // onStampClick={handleStampClick}
        />
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
