import { ReactElement, useEffect, useMemo, useState } from "react";
import { UserStatus } from "@/lib/core/user";
import VirtualRewardsEventPageLayout from "./VirtualRewardsEventPageLayout";
import VirtualRewardsEventHero from "./VirtualRewardsEventHero";
import Card from "../Card";
import { CaretDoubleRight, CheckCircle, ShareNetwork } from "phosphor-react";
import virtualRewardsEventThemeFooterImageUrl from "@/images/virtual-rewards-event-theme-footer.svg";
import refyneBharatDarshanLogo from "@/images/refyne_bharat_darshan_logo.svg";
import cardBackgroundUrl from "@/images/card_background.svg";
import { ListWithCustomIcons } from "../List";
import InfoCard from "../InfoCard";
import { getRandomNumberInRange } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import StampWrapper, { StampWrapperImage } from "../StampWrapper";
import { StampPodium, StampPodiumStage } from "../StampPodium";
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

interface StampInfo {
  illustrationUrl: string;
  title: string;
  description: string;
}

export interface Stamp {
  id: string;
  imageUrl: string;
  count: number;
  name?: string;
  info?: StampInfo;
}

interface StampPodiumStageConfig {
  backgroundColor: string;
  stampBorderColor: string;
}

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
  stampPodiumStages: Array<StampPodiumStageConfig>;
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
  stampPodiumStages,
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

  const podiumStages = useMemo(
    () => getStampsConfig(stampPodiumStages, stamps),
    [stampPodiumStages, stamps]
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
      navbarText={t("stamps_landing_page_header_bar_text")}
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
        height="66rem"
        footer={
          <Card backgroundColor="#FDEECA">
            <h4 className="text-body text-medium text-center">
              {tWithoutTypeSafety(socialProofTexts[randomSocialProofIndex])}
            </h4>
          </Card>
        }
        background={
          <RiveWrapper
            src="/assets/animations/virtual_rewards_event_hero_animation.riv"
            position="cover_center"
            autoplay
          />
        }
      >
        <Image src={refyneBharatDarshanLogo} alt="Refyne Bharat Darshan" />
        <h3 className="text-heading text-semi-bold text-center">
          {t("stamps_page_heading")}
        </h3>
        <StampPodium
          bottomBorderColor={
            podiumStages[podiumStages.length - 1].backgroundColor
          }
        >
          {podiumStages.map((stampStage, stageIndex) => (
            <StampPodiumStage
              backgroundColor={stampStage.backgroundColor}
              key={stageIndex}
            >
              {stampStage.stamps.map((stamp) => (
                <StampWrapper
                  key={stamp.id}
                  borderColor={stamp.borderColor}
                  count={stamp.count}
                  disableWhenCountIsZero
                  onClick={() => handleStampClick(stamp.id, stamp.info)}
                >
                  <StampWrapperImage
                    imageUrl={stamp.imageUrl}
                    name={stamp.name ?? "Stamp"}
                  />
                </StampWrapper>
              ))}
            </StampPodiumStage>
          ))}
        </StampPodium>
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
      {banner && (
        <div className="px-4 mb-4">
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
                Wohoo! You’ve completed all of today’s actions
              </p>
              <h5 className="text-body text-semibold text-center mt-2 mb-4">
                You can always earn more stamps by referring your co-workers
              </h5>
              <RoundedButton onClick={onReferCtaClick}>Refer Now</RoundedButton>
            </div>
          </Card>
        </div>
      ) : stampCollectionActions && stampCollectionActions.length > 0 ? (
        <div className="px-4 mb-4">
          <h3 className="text-heading text-medium">
            How to collect stamps today
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
          src={virtualRewardsEventThemeFooterImageUrl.src}
          alt="Virtual Rewards Event Theme Footer"
        />
      </div>
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
      className={`btn btn-primary btn-compact btn-rounded flex-center ${
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

function getStampsConfig(
  podiumStages: Array<StampPodiumStageConfig>,
  stamps: Array<Stamp>
): Array<{
  backgroundColor: string;
  stamps: Array<
    Stamp & {
      borderColor: string;
    }
  >;
}> {
  // INFO: Hardcoding for now
  const startIndexes = [0, 1, 3, 6, 10];
  return podiumStages.map((stage, index) => {
    const { backgroundColor, stampBorderColor } = stage;

    const itemsRequiredInThisStage = index + 1;
    const startIndex = startIndexes[index];
    const endIndex = startIndex + itemsRequiredInThisStage - 1;

    const stampsConfig: Array<
      Stamp & {
        borderColor: string;
      }
    > = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const stampAtThisIndex = stamps[i];
      if (!stampAtThisIndex) continue;
      stampsConfig.push({
        ...stampAtThisIndex,
        borderColor: stampBorderColor,
      });
    }
    return { backgroundColor, stamps: stampsConfig };
  });
}
