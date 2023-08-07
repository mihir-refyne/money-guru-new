import { useEffect } from "react";
import { UserStatus } from "@/lib/core/user";
import IndependenceDayLayout from "./IndependenceDayLayout";
import IndependenceDayHero from "./IndependenceDayHero";
import Card from "../Card";
import CountdownDisplay from "../CoundownDisplay";
import { CaretDoubleRight, ShareNetwork } from "phosphor-react";
import independenceDayThemeFooterImageUrl from "@/images/independence-day-theme-footer.svg";
import idsHypeHeroBackgroundImageUrl from "@/images/ids_hype_hero_background.jpg";
import cardBackgroundUrl from "@/images/card_background.svg";
import { ListWithCustomIcons } from "../List";
import InfoCard from "../InfoCard";
import { getRandomNumberInRange } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface IndependenceDayHypeProps {
  remainingTimeInSecForFestivalToStart: number;
  userStatus: string;
  gameRules: Array<{ iconUrl: string; text: string }>;
  socialProofTexts: Array<string>;
  isShareLoading: boolean;
  onMount?: () => void;
  onCompleteKycClick?: () => void;
  onIncompleteKycClick?: () => void;
  onShareClick?: (source: "HERO_BUTTON" | "FOOTER_BUTTON") => void;
  onFaqClick?: () => void;
  onCountdownFinish?: () => void;
}

export default function IndependenceDayHype({
  userStatus,
  remainingTimeInSecForFestivalToStart,
  gameRules,
  socialProofTexts,
  isShareLoading,
  onMount,
  onCompleteKycClick,
  onIncompleteKycClick,
  onShareClick,
  onFaqClick,
  onCountdownFinish,
}: IndependenceDayHypeProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");

  useEffect(() => {
    onMount?.();
  }, []);

  function handleHeroShareClick() {
    onShareClick?.("HERO_BUTTON");
  }

  const randomSocialProofIndex = getRandomNumberInRange(
    0,
    socialProofTexts.length - 1
  );
  return (
    <IndependenceDayLayout
      navbarText={t("stamps_landing_page_header_bar_text")}
      footer={
        <PageFooter
          userStatus={userStatus}
          onCompleteKycClick={onCompleteKycClick}
          onIncompleteKycClick={onIncompleteKycClick}
          onShareClick={onShareClick}
          isShareLoading={isShareLoading}
        />
      }
    >
      <IndependenceDayHero
        height="60rem"
        footer={
          <Card backgroundColor="#FDEECA">
            <h4 className="text-body text-medium text-center">
              {tWithoutTypeSafety(socialProofTexts[randomSocialProofIndex])}
            </h4>
          </Card>
        }
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
      >
        <h3 className="text-heading text-medium text-center">
          {t("stamps_hype_page_heading")}
        </h3>
        <CountdownDisplay
          durationInSec={remainingTimeInSecForFestivalToStart}
          separatorColor="#C9CDD1"
          onFinish={onCountdownFinish}
        />
        <RoundedShareButton
          loading={isShareLoading}
          onClick={handleHeroShareClick}
        >
          {t("stamps_share_now")}
        </RoundedShareButton>
      </IndependenceDayHero>
      <div className="px-4">
        <h3 className="text-heading text-medium mb-4">
          {t("stamps_game_rules_header")}
        </h3>

        <Card backgroundImageUrl={cardBackgroundUrl.src} backgroundSize="100%">
          <ListWithCustomIcons
            items={gameRules.map((rule) => ({
              icon: <img src={rule.iconUrl} alt={rule.text} />,
              text: tWithoutTypeSafety(rule.text),
            }))}
          />
        </Card>
        <button
          className="btn btn-text btn-inline flex-center"
          onClick={onFaqClick}
        >
          <span>{t("stamps_faq_hyperlink_text")}</span>
          <CaretDoubleRight size={16} />
        </button>
      </div>
      <div className="mt-4">
        <InfoCard transparentBackground>
          {t("stamps_disclaimer_footer_text")}
        </InfoCard>
      </div>
      <div
        style={{
          marginTop: "-4rem",
          marginBottom: "-0.8rem",
        }}
      >
        <img
          style={{
            width: "100%",
          }}
          src={independenceDayThemeFooterImageUrl.src}
          alt="Independence Day Theme Footer"
        />
      </div>
    </IndependenceDayLayout>
  );
}

function RoundedShareButton(props: {
  loading: boolean;
  children: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="btn btn-primary btn-compact btn-rounded flex-center px-4"
      onClick={props.onClick}
      disabled={props.loading}
    >
      <span className="mr-2">{props.children}</span>
      <ShareNetwork weight="fill" size={16} />
    </button>
  );
}

function PageFooter(props: {
  isShareLoading: boolean;
  userStatus: string;
  onCompleteKycClick?: () => void;
  onIncompleteKycClick?: () => void;
  onShareClick?: (source: "HERO_BUTTON" | "FOOTER_BUTTON") => void;
}) {
  const { tWithoutTypeSafety } = useTranslation("common");
  const { text, ctaLabel, actionType } = getFooterDataByStatus(
    props.userStatus
  );

  function handleCtaClick() {
    if (actionType === "KYC_PENDING") {
      return props.onCompleteKycClick?.();
    }
    if (actionType === "KYC_INCOMPLETE") {
      return props.onIncompleteKycClick?.();
    }
    if (actionType === "SHARE") {
      return props.onShareClick?.("FOOTER_BUTTON");
    }
  }

  return (
    <div>
      <div className="py-2" style={{ backgroundColor: "#EBF5FF" }}>
        <h5 className="text-caption text-medium text-center">
          {tWithoutTypeSafety(text)}
        </h5>
      </div>
      <div className="p-4">
        <button
          className="btn btn-primary btn-block"
          disabled={
            props.isShareLoading || actionType === "KYC_VERIFICATION_PENDING"
          }
          onClick={handleCtaClick}
        >
          {tWithoutTypeSafety(ctaLabel)}
        </button>
      </div>
    </div>
  );
}

function getFooterDataByStatus(userStatus: string): {
  text: string;
  ctaLabel: string;
  actionType:
    | "KYC_PENDING"
    | "KYC_INCOMPLETE"
    | "KYC_VERIFICATION_PENDING"
    | "SHARE";
} {
  if (
    userStatus === UserStatus.VERIFICATION_PENDING ||
    userStatus === UserStatus.USER_MODIFIED_VERIFICATION_PENDING
  ) {
    return {
      text: "stamps_cta_header_text_verif_pending",
      ctaLabel: "stamps_cta_verif_pending",
      actionType: "KYC_VERIFICATION_PENDING",
    };
  }
  if (
    userStatus === UserStatus.INCOMPLETE_INFO ||
    userStatus === UserStatus.USER_MODIFIED_INCORRECT_INFO
  ) {
    return {
      text: "stamps_cta_header_text_pre_kyc",
      ctaLabel: "stamps_cta_pre_kyc",
      actionType: "KYC_INCOMPLETE",
    };
  }
  if (
    userStatus === UserStatus.INITIATED ||
    userStatus === UserStatus.SALARY_VIEWABLE
  ) {
    return {
      text: "stamps_cta_header_text_pre_kyc",
      ctaLabel: "stamps_cta_pre_kyc",
      actionType: "KYC_PENDING",
    };
  }
  return {
    text: "stamps_cta_header_text_refyne_verified",
    ctaLabel: "stamps_cta_refyne_verified",
    actionType: "SHARE",
  };
}
