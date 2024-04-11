import { ReactElement, useEffect, useState } from "react";
import { UserStatus } from "@/lib/core/user";
import VirtualRewardsEventPageLayout from "./VirtualRewardsEventPageLayout";
import VirtualRewardsEventHero from "./VirtualRewardsEventHero";
import Card from "../Card";
import { CaretDoubleRight, CheckCircle, ShareNetwork } from "phosphor-react";
import virtualRewardsEventThemeFooterImageUrl from "@/images/virtual-rewards-event-theme-footer.svg";
import refyneVirtualRewardsEventLogo from "@/images/refyne_virtual_rewards_event_logo.svg";
import cardBackgroundUrl from "@/images/card_background.svg";
import { ListWithCustomIcons } from "../List";
import InfoCard from "../InfoCard";
import { getRandomNumberInRange } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import RiveWrapper from "../RiveWrapper";
import { TaskCard, TaskCardItem } from "../TaskCard";
import Modal from "../Modal";
import StampInfoCard from "../StampInfoCard";
import { AppModalConfig, RedirectDetails } from "@/lib/core/ui-metadata";
import { UserRewardsSummary } from "@/lib/core/user-rewards";
import ShortMedia from "../Shorts/ShortMedia";
import BannerWithCountdownCta, {
  BannerWithCountdownCtaProps,
} from "../Banner/BannerWithCountdownCta";
import Banner from "../Banner";
import VirtualRewardsEventStampStage, {
  Stamp,
} from "./VirtualRewardsEventStampStage";
import { StampPodiumStageConfig } from "./VirtualRewardsEventStampStage/StampStagePodium";
import type { StampCountPosition } from "../StampWrapper";

type StampInfo = NonNullable<Stamp["info"]>;

interface VirtualRewardsEventRegularProps {
  userStatus: string;
  canGiftAndRequest: boolean;
  canShare?: boolean;
  isGiftingEnabled: boolean;
  isRequestEnabled?: boolean;
  gameRuleVideoUrl?: string | null;
  gameRules: Array<{ iconUrl: string; text: string }>;
  socialProofTexts: Array<string>;
  isShareLoading: boolean;
  stamps: Array<Stamp>;
  stampCountBorderColor?: string;
  stampCountDisplayPosition?: StampCountPosition;
  stampPodiumStages: Array<StampPodiumStageConfig>;
  stampPodiumBackground?: string;
  stampPodiumBorder?: string;
  stampPodiumStageHasBottomBorder?: boolean;
  heroBackgroundRiveUrl: string | null;
  heroBackgroundImageUrl: string | null;
  heroElementHeight: string;
  heroElementTextColor?: string;
  heroFooterBackgroundColor: string;
  banner?: Partial<BannerWithCountdownCtaProps>;
  stampCollectionActions?: Array<UserRewardsSummary>;
  allStampCollectionActionsCompleted?: boolean;
  onMount?: () => void;
  onBannerMount?: () => void;
  onBannerCountdownExpiry?: () => void;
  onStampClick?: (id: string) => void;
  onStampCollectionActionShown?: (context: {
    actionName?: string;
    completedCount?: number;
    totalCount?: number;
  }) => void;
  onStampCollectionActionClick?: (context: {
    actionName?: string;
    completedCount?: number;
    totalCount?: number;
    redirectDetails?: RedirectDetails;
  }) => void;
  onStampCollectionActionRouting?: (onClick: RedirectDetails) => void;
  onCompleteKycClick?: () => void;
  onIncompleteKycClick?: () => void;
  onShareClick?: (source: "HERO_BUTTON" | "FOOTER_BUTTON") => void;
  onStampInfoShareClick?: (payload: { imageUrl: string; text: string }) => void;
  onGiftCtaClick?: (source: "HERO_BUTTON") => void;
  onRequestCtaClick?: (source: "HERO_BUTTON" | "MODAL_BUTTON") => void;
  onReferCtaClick?: () => void;
  onFaqClick?: () => void;
}

export default function VirtualRewardsEventRegular({
  userStatus,
  gameRuleVideoUrl,
  gameRules,
  canGiftAndRequest,
  canShare = true,
  isGiftingEnabled,
  isRequestEnabled = false,
  socialProofTexts,
  isShareLoading,
  stamps,
  stampCountBorderColor,
  stampCountDisplayPosition,
  stampPodiumStages,
  stampPodiumStageHasBottomBorder,
  stampPodiumBackground,
  stampPodiumBorder,
  heroBackgroundRiveUrl,
  heroBackgroundImageUrl,
  heroElementHeight,
  heroElementTextColor,
  heroFooterBackgroundColor,
  banner,
  stampCollectionActions,
  allStampCollectionActionsCompleted,
  onMount,
  onBannerMount,
  onBannerCountdownExpiry,
  onStampClick,
  onStampInfoShareClick,
  onStampCollectionActionClick,
  onStampCollectionActionShown,
  onStampCollectionActionRouting,
  onCompleteKycClick,
  onIncompleteKycClick,
  onShareClick,
  onGiftCtaClick,
  onRequestCtaClick,
  onReferCtaClick,
  onFaqClick,
}: VirtualRewardsEventRegularProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const [stampInfoModalContent, setStampInfoModalContent] =
    useState<StampInfo | null>(null);
  const [actionInfoModal, setActionInfoModal] = useState<AppModalConfig | null>(
    null
  );

  useEffect(() => {
    onMount?.();
  }, []);

  function handleHeroShareClick() {
    onShareClick?.("HERO_BUTTON");
  }
  function handleHeroGiftCtaClick() {
    onGiftCtaClick?.("HERO_BUTTON");
  }
  function handleHeroRequestCtaClick() {
    onRequestCtaClick?.("HERO_BUTTON");
  }
  function handleStampInfoModalClose() {
    setStampInfoModalContent(null);
  }
  function handleStampInfoModalShareClick(payload: {
    imageUrl: string;
    text: string;
  }) {
    handleStampInfoModalClose();
    onStampInfoShareClick?.(payload);
  }
  function handleStampInfoModalRequestCtaClick() {
    handleStampInfoModalClose();
    onRequestCtaClick?.("MODAL_BUTTON");
  }

  function handleStampClick(stampId: string, info?: StampInfo) {
    onStampClick?.(stampId);
    if (info) {
      setStampInfoModalContent(info);
    }
  }

  function handleActionInfoModalClose() {
    setActionInfoModal(null);
  }
  function handleStampCollectionActionClick(context: {
    actionName?: string;
    completedCount?: number;
    totalCount?: number;
    redirectDetails?: RedirectDetails;
  }) {
    const { redirectDetails } = context;
    if (!redirectDetails) return;
    onStampCollectionActionClick?.(context);
    if (redirectDetails.appModal) {
      setActionInfoModal(redirectDetails.appModal);
      return;
    }
    onStampCollectionActionRouting?.(redirectDetails);
  }
  function handleActionInfoModalCtaClick(
    redirectDetails?: Omit<RedirectDetails, "appModal">
  ) {
    handleActionInfoModalClose();
    if (redirectDetails) {
      onStampCollectionActionRouting?.(redirectDetails);
    }
  }

  const randomSocialProofIndex = getRandomNumberInRange(
    0,
    socialProofTexts.length - 1
  );
  return (
    <VirtualRewardsEventPageLayout
      footer={
        <PageFooter
          userStatus={userStatus}
          onCompleteKycClick={onCompleteKycClick}
          onIncompleteKycClick={onIncompleteKycClick}
          isShareLoading={isShareLoading}
        />
      }
    >
      <VirtualRewardsEventHero
        height={heroElementHeight}
        footer={
          <Card backgroundColor={heroFooterBackgroundColor}>
            <h4 className="text-body text-medium text-center">
              {tWithoutTypeSafety(socialProofTexts[randomSocialProofIndex])}
            </h4>
          </Card>
        }
        background={
          heroBackgroundRiveUrl ? (
            <RiveWrapper
              src={heroBackgroundRiveUrl}
              position="cover_center"
              autoplay
            />
          ) : heroBackgroundImageUrl ? (
            <img
              src={heroBackgroundImageUrl}
              alt="Refyne Festival Hype Hero Background"
              height="100%"
              width="100%"
              style={{
                objectFit: "cover",
              }}
            />
          ) : undefined
        }
      >
        {/* <Image
          src={refyneVirtualRewardsEventLogo}
          alt="Refyne Virtual Rewards Event"
        /> */}
        <h3
          className="text-heading text-semi-bold text-center"
          style={{ color: heroElementTextColor }}
        >
          {t("stamps_page_heading")}
        </h3>
        <VirtualRewardsEventStampStage
          stamps={stamps}
          stampCountBorderColor={stampCountBorderColor}
          stampCountDisplayPosition={stampCountDisplayPosition}
          hasBottomBorder={stampPodiumStageHasBottomBorder}
          podiumBackground={stampPodiumBackground}
          podiumBorder={stampPodiumBorder}
          podiumStages={stampPodiumStages}
          onStampClick={handleStampClick}
        />
        <div
          className="flex-center"
          style={{
            gap: "var(--spacing-4)",
          }}
        >
          {canGiftAndRequest && (
            <RoundedButton
              disabled={!isGiftingEnabled}
              onClick={handleHeroGiftCtaClick}
            >
              Gift
            </RoundedButton>
          )}
          {canGiftAndRequest && (
            <RoundedButton
              disabled={!isRequestEnabled}
              onClick={handleHeroRequestCtaClick}
            >
              Request
            </RoundedButton>
          )}
          {canShare && (
            <RoundedButton
              icon={<ShareNetwork weight="fill" size={16} />}
              onClick={handleHeroShareClick}
            >
              {!canGiftAndRequest ? t("stamps_share_now") : undefined}
            </RoundedButton>
          )}
        </div>
      </VirtualRewardsEventHero>
      {allStampCollectionActionsCompleted ? (
        <div className="px-4 mb-4">
          <Card backgroundColor="var(--clr-grey-light)">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle
                size={88}
                color="var(--clr-info-success-default)"
                weight="fill"
              />
              <p className="text-caption clr-text-secondary mt-4">
                Woohoo! All your actions for today are complete.
              </p>
              <h5 className="text-body text-semibold text-center mt-2 mb-4">
                Get new actions everyday or you can also REFER a friend and earn
                more stamps!
              </h5>
              <RoundedButton onClick={onReferCtaClick}>Refer Now</RoundedButton>
            </div>
          </Card>
        </div>
      ) : stampCollectionActions && stampCollectionActions.length > 0 ? (
        <div className="px-4 mb-4">
          <h3 className="text-heading text-medium">
            {t("stamps_page_action_header")}
          </h3>
          <p className="text-caption text-regular clr-text-secondary mb-2">
            Complete actions in any order, your actions will reset tomorrow
          </p>
          <div className="mt-4">
            <TaskCard>
              {stampCollectionActions.map((action) => (
                <TaskCardItem
                  key={action.rewardId}
                  leftIconUrl={action.uiMetadata.imageUrl}
                  text={tWithoutTypeSafety(
                    action.uiMetadata?.header?.text ?? "",
                    action.uiMetadata?.header?.templateContext
                  )}
                  completedCount={action.actionMetadata.completedCountToday}
                  totalCount={action.actionMetadata.perDayLimit}
                  onClick={() =>
                    handleStampCollectionActionClick({
                      actionName: action.uiMetadata?.header?.text,
                      completedCount: action.actionMetadata.completedCountToday,
                      totalCount: action.actionMetadata.perDayLimit,
                      redirectDetails: action?.uiMetadata?.onClick,
                    })
                  }
                  onMount={() =>
                    onStampCollectionActionShown?.({
                      actionName: action.uiMetadata?.header?.text,
                      completedCount: action.actionMetadata.completedCountToday,
                      totalCount: action.actionMetadata.perDayLimit,
                    })
                  }
                />
              ))}
            </TaskCard>
          </div>
        </div>
      ) : null}
      <div className="px-4">
        <h3 className="text-heading text-medium mb-4">
          {t("stamps_game_rules_header")}
        </h3>
        <Card backgroundImageUrl={cardBackgroundUrl.src} backgroundSize="100%">
          {gameRuleVideoUrl && (
            <div className="mb-4">
              <ShortMedia
                type="video"
                url={gameRuleVideoUrl}
                hideIfNotInView={false}
                autoplay={false}
                controls={true}
              />
            </div>
          )}
          <ListWithCustomIcons
            items={gameRules.map((rule) => ({
              icon: <img src={rule.iconUrl} alt={rule.text} />,
              text: tWithoutTypeSafety(rule.text),
            }))}
          />
        </Card>
        {/* <button
          className="btn btn-text btn-inline flex-center"
          onClick={onFaqClick}
        >
          <span>{t("stamps_faq_hyperlink_text")}</span>
          <CaretDoubleRight size={16} />
        </button> */}
      </div>
      {banner && (
        <div className="px-4 my-4">
          {banner.countdownForInSec !== undefined ? (
            <BannerWithCountdownCta
              {...banner}
              heading={tWithoutTypeSafety(banner.heading ?? "")}
              description={tWithoutTypeSafety(banner.description ?? "")}
              ctaLabel={tWithoutTypeSafety(banner.ctaLabel ?? "")}
              countdownForInSec={banner.countdownForInSec}
              onMount={onBannerMount}
              onCountdownExpiry={onBannerCountdownExpiry}
            />
          ) : (
            <Banner
              {...banner}
              heading={tWithoutTypeSafety(banner.heading ?? "")}
              description={tWithoutTypeSafety(banner.description ?? "")}
              ctaLabel={tWithoutTypeSafety(banner.ctaLabel ?? "")}
              onMount={onBannerMount}
            />
          )}
        </div>
      )}
      <div className="mt-4 mb-6">
        <InfoCard transparentBackground>
          {t("stamps_disclaimer_footer_text")}
        </InfoCard>
      </div>
      {/* <div
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
      </div> */}
      <Modal
        active={stampInfoModalContent !== null}
        onClose={handleStampInfoModalClose}
        bottomSheetOnMobile
      >
        <StampInfoCard
          {...stampInfoModalContent}
          onShareClick={handleStampInfoModalShareClick}
          hasRequest={canGiftAndRequest}
          onRequestClick={handleStampInfoModalRequestCtaClick}
        />
      </Modal>
      <Modal
        active={actionInfoModal !== null}
        onClose={handleActionInfoModalClose}
        bottomSheetOnMobile
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {actionInfoModal?.icon && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {actionInfoModal?.icon && (
                <img
                  src={actionInfoModal?.icon}
                  alt={actionInfoModal?.header}
                  className="mb-6"
                />
              )}
              {actionInfoModal.header && (
                <h4 className="text-heading text-medium text-center mb-3">
                  {tWithoutTypeSafety(actionInfoModal.header)}
                </h4>
              )}
              {actionInfoModal.desc && (
                <p className="text-body clr-text-secondary text-center mb-8">
                  {tWithoutTypeSafety(actionInfoModal.desc)}
                </p>
              )}
              {actionInfoModal.CTAText && (
                <button
                  className="btn btn-primary btn-block"
                  onClick={() =>
                    handleActionInfoModalCtaClick(actionInfoModal.onClick)
                  }
                >
                  {tWithoutTypeSafety(actionInfoModal.CTAText)}
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>
    </VirtualRewardsEventPageLayout>
  );
}

function RoundedButton(props: {
  disabled?: boolean;
  children?: string;
  onClick?: () => void;
  icon?: ReactElement;
}) {
  const { disabled, children, onClick, icon } = props;
  const onlyIcon = icon && !children;
  const hasBothIconAndText = icon && children;
  return (
    <button
      className={`btn btn-primary-outline btn-compact btn-rounded flex-center clr-text-primary ${
        !onlyIcon ? "px-6" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={hasBothIconAndText ? "mr-2" : undefined}>
        {children}
      </span>
      {icon}
    </button>
  );
}

function PageFooter(props: {
  isShareLoading: boolean;
  userStatus: string;
  onCompleteKycClick?: () => void;
  onIncompleteKycClick?: () => void;
}) {
  const { tWithoutTypeSafety } = useTranslation("common");
  const footerData = getFooterDataByStatus(props.userStatus);

  if (!footerData) return null;
  const { text, ctaLabel, actionType } = footerData;

  function handleCtaClick() {
    if (actionType === "KYC_PENDING") {
      return props.onCompleteKycClick?.();
    }
    if (actionType === "KYC_INCOMPLETE") {
      return props.onIncompleteKycClick?.();
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
  actionType: "KYC_PENDING" | "KYC_INCOMPLETE" | "KYC_VERIFICATION_PENDING";
} | null {
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
  return null;
}
