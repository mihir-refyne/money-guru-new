import useTranslation from "@/hooks/useTranslation";
import VirtualRewardsEventPageLayout from "./VirtualRewardsEventPageLayout";
import idsendHeroBackgroundImageUrl from "@/images/ids_end_hero_background.png";
import virtualRewardsEventThemeFooterImageUrl from "@/images/virtual-rewards-event-theme-footer.svg";
import Card from "../Card";
import { useEffect } from "react";
import { ListWithCustomIcons } from "../List";
import InfoCard from "../InfoCard";

interface VirtualRewardsEventEndProps {
  onMount?: () => void;
  onRedeemClick?: () => void;
}

export default function VirtualRewardsEventEnd({
  onMount,
  onRedeemClick,
}: VirtualRewardsEventEndProps) {
  const { t } = useTranslation("common");
  useEffect(() => {
    onMount?.();
  }, []);
  return (
    <VirtualRewardsEventPageLayout
      navbarText={t("stamps_landing_page_header_bar_text")}
    >
      <img
        src={idsendHeroBackgroundImageUrl.src}
        alt="IDS Hype Hero Background"
        height="100%"
        width="100%"
        style={{
          objectFit: "cover",
        }}
      />
      <div className="px-4 mt-6">
        <h3 className="text-heading text-medium mb-4">
          {t("all_stamps_collected_step_header")}
        </h3>
        <Card backgroundColor="#EBF5FF">
          <ListWithCustomIcons
            items={[
              {
                icon: (
                  <img
                    src="/assets/images/virtual-rewards-event/giftbox_icon.svg"
                    alt="Reward"
                  />
                ),
                text: t("all_stamps_collected_step"),
              },
            ]}
          />
          <div className="mt-4 ml-6">
            <button
              className="btn btn-primary btn-compact btn-rounded px-4"
              onClick={onRedeemClick}
            >
              {t("all_stamps_collected_step_cta")}
            </button>
          </div>
        </Card>
      </div>
      <div className="mt-4">
        <InfoCard transparentBackground>
          {t("stamps_disclaimer_footer_text")}
        </InfoCard>
      </div>
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
