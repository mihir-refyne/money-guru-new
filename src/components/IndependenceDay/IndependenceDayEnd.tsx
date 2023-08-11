import useTranslation from "@/hooks/useTranslation";
import IndependenceDayLayout from "./IndependenceDayLayout";
import idsendHeroBackgroundImageUrl from "@/images/ids_end_hero_background.png";
import Card from "../Card";
import { useEffect } from "react";
import { ListWithCustomIcons } from "../List";

interface IndependenceDayEndProps {
  onMount?: () => void;
  onRedeemClick?: () => void;
}

export default function IndependenceDayEnd({
  onMount,
  onRedeemClick,
}: IndependenceDayEndProps) {
  const { t } = useTranslation("common");
  useEffect(() => {
    onMount?.();
  }, []);
  return (
    <IndependenceDayLayout
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
          Redeem your prizes now
        </h3>
        <Card backgroundColor="#EBF5FF">
          <ListWithCustomIcons
            items={[
              {
                icon: (
                  <img src="/assets/images/ids/giftbox_icon.svg" alt="Reward" />
                ),
                text: "Tap on the Independence Day Scratch card to open your prize",
              },
            ]}
          />
          <div className="mt-4 ml-6">
            <button
              className="btn btn-primary btn-compact btn-rounded px-4"
              onClick={onRedeemClick}
            >
              Redeem
            </button>
          </div>
        </Card>
      </div>
    </IndependenceDayLayout>
  );
}
