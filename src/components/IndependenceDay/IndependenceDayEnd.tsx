import useTranslation from "@/hooks/useTranslation";
import IndependenceDayHero from "./IndependenceDayHero";
import IndependenceDayLayout from "./IndependenceDayLayout";
import refyneBharatDarshanLogo from "@/images/refyne_bharat_darshan_logo.svg";
import idsHypeHeroBackgroundImageUrl from "@/images/ids_hype_hero_background.jpg";
import Image from "next/image";
import Card from "../Card";
import { useEffect } from "react";

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
      <IndependenceDayHero
        height="56rem"
        background={
          <img
            src={idsHypeHeroBackgroundImageUrl.src}
            alt="IDS Hype Hero Background"
            height="100%"
            width="100%"
            style={{
              objectFit: "cover",
            }}
          />
        }
        footer={
          <Card backgroundColor="#FDEECA">
            <h4 className="text-body text-medium text-center">
              You’ve collected all 6 Independence day stamps
            </h4>
          </Card>
        }
      >
        <Image src={refyneBharatDarshanLogo} alt="Refyne Bharat Darshan" />
      </IndependenceDayHero>
      <h3 className="text-heading text-medium mb-4">Redeem your prizes now</h3>
      <p className="text-body clr-text-secondary mb-2">
        Tap on the Independence Day Scratch card to open your prize
      </p>
      <div>
        <button
          className="btn btn-primary btn-compact btn-rounded"
          onClick={onRedeemClick}
        >
          Redeem
        </button>
      </div>
    </IndependenceDayLayout>
  );
}
