import { useEffect, useMemo, useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import VirtualRewardsEventHype from "@/components/VirtualRewardsEvent/VirtualRewardsEventHype";
import VirtualRewardsEventRegular from "@/components/VirtualRewardsEvent/VirtualRewardsEventRegular";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import config from "../../../data/virtual_rewards_event_config.json";
import { useShare } from "@/hooks/useShare";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { useRouter } from "next/router";
import { APP_BASE_URL, ONE_HOUR_IN_SEC } from "@/constants";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanelPromise } from "@/lib/analytics/mixpanel";
import { isIOS, isWebview } from "@/lib/utils";
import { UserStatus } from "@/lib/core/user";
import useFetcher from "@/hooks/useFetcher";
import {
  FestiveEventConfig,
  UserVirtualRewardSummary,
  claimFestiveEvent,
  claimVirtualRewardGift,
  generateVirtualRewardGiftLink,
  generateVirtualRewardRequestLink,
  getFestiveEvents,
  getUserRewardsSummary,
  getUserVirtualRewardSummary,
  giftVirtualReward,
} from "@/lib/core/user-rewards";
import Modal from "@/components/Modal";
import StampSelectionCard from "@/components/StampSelectionCard";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import { toast } from "react-hot-toast";
import { RedirectDetails, ScreenToAppRouteIdMap } from "@/lib/core/ui-metadata";
import StampInfoCard from "@/components/StampInfoCard";
import { BannerProps } from "@/components/Banner";
import { BannerWithCountdownCtaProps } from "@/components/Banner/BannerWithCountdownCta";
import differenceInSeconds from "date-fns/differenceInSeconds";
import LoadingPage from "@/components/LoadingPage";
import VirtualRewardsEventEnd from "@/components/VirtualRewardsEvent/VirtualRewardsEventEnd";
import { Stamp } from "@/components/VirtualRewardsEvent/VirtualRewardsEventStampStage";
import { StampCountPosition } from "@/components/StampWrapper";

// TODO: Maybe move to a helper
function addUserTokenInUrlIfRequired(
  url: string,
  addUserToken: boolean,
  userToken?: string
) {
  if (!addUserToken || !userToken) return url;
  return addQueryInUrl(url, "userToken", userToken);
}
function addQueryInUrl(url: string, queryKey: string, value?: string) {
  if (!value) return url;
  const hasQuery = url.includes("?");
  const joinUsing = hasQuery ? "&" : "?";
  return `${url}${joinUsing}${queryKey}=${value}`;
}

function fetcherWrapperToHandleHypeDays<A extends unknown[], T>(
  isHypeDay: boolean,
  callbackFn: (...args: A) => T
): (...args: A) => T | null {
  return (...args: A) => {
    if (isHypeDay) return null;
    return callbackFn(...args);
  };
}

function getStampInfoFromConfigById(
  configMap: Record<string, Omit<Stamp, "id" | "count"> | undefined>,
  id: string
) {
  const config = configMap[id];
  return config;
}

function getStampsFromVirtualRewardsAndConfig(
  virtualRewards: Array<UserVirtualRewardSummary> | undefined,
  configMap: Record<string, Omit<Stamp, "id" | "count">>
): Array<Stamp> {
  if (!virtualRewards) return [];
  const stamps: Array<Stamp> = [];
  for (const virtualReward of virtualRewards) {
    const config = getStampInfoFromConfigById(
      configMap,
      virtualReward.rewardId
    );
    if (!config) continue;
    stamps.push({
      id: virtualReward.rewardId,
      count: virtualReward.wonCount ?? 0,
      ...config,
    });
  }
  return stamps;
}

function getActionTypeByReferenceId(
  refId?: string
): "STAMP_GIFT" | "STAMP_REQUEST" | undefined {
  if (!refId) return;
  if (refId.includes(":")) return "STAMP_GIFT";
  if (refId.startsWith("USR")) return "STAMP_REQUEST";
}

interface ServerSideResponse {
  isHypeCreationDay: boolean;
  isFestivalEnded: boolean;
  remainingTimeInSecForFestivalToStart: number;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideResponse
> = async () => {
  const festivalStart = new Date(config.festiveStartDate);
  const festivalEnd = new Date(config.festiveEndDate);
  const today = new Date();

  const remainingTimeInMsForFestivalToStart = Math.max(
    festivalStart.getTime() - today.getTime(),
    0
  );
  const remainingTimeInSecForFestivalToStart = Math.floor(
    remainingTimeInMsForFestivalToStart / 1000
  );
  const isHypeCreationDay = remainingTimeInMsForFestivalToStart > 0;
  const isFestivalEnded = today > festivalEnd;

  return {
    props: {
      isHypeCreationDay,
      isFestivalEnded,
      remainingTimeInSecForFestivalToStart,
    },
  };
};

export default function VirtualRewardsEventLandingPage({
  isHypeCreationDay,
  isFestivalEnded,
  remainingTimeInSecForFestivalToStart,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const userStatus = getValueFromMetadata("status");
  const idToken = getValueFromMetadata("idToken");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);

  const eventType = isHypeCreationDay ? "hype_creation" : "regular_flow";

  const {
    isLoading: isVirtualRewardsFetching,
    data: virtualRewardsResponse,
    refetch: refetchVirtualRewards,
  } = useFetcher(
    fetcherWrapperToHandleHypeDays(
      isHypeCreationDay,
      getUserVirtualRewardSummary
    )
  );
  const { isLoading: isUserRewardsFetching, data: userRewardsResponse } =
    useFetcher(
      fetcherWrapperToHandleHypeDays(isHypeCreationDay, getUserRewardsSummary)
    );
  const { isLoading: isFestiveEventsFetching, data: festiveEvents } =
    useFetcher(
      fetcherWrapperToHandleHypeDays(isHypeCreationDay, getFestiveEvents)
    );

  const router = useRouter();
  const [isLocaleLoading, setIsLocaleLoading] = useState<boolean>(true);
  const [stampGiftModalContext, setStampGiftModalContext] = useState<{
    requestId?: string;
    title: string;
    description: string;
  } | null>(null);
  const [stampInfoModalContent, setStampInfoModalContent] = useState<{
    stampId: string;
    illustrationUrl?: string;
    title: string;
    description: string;
  } | null>(null);

  const { shareInProgress, shareOrClipboardCopy } = useShare({
    isNativePlatformShareSupported: isRefyneWebview && !isIOS(),
  });

  const STAMPS = useMemo(
    () =>
      getStampsFromVirtualRewardsAndConfig(
        virtualRewardsResponse?.rewards,
        config.rewardIdToStampsConfigMap
      ),
    [virtualRewardsResponse?.rewards]
  );
  const stampsYetToBeCollected = useMemo(
    () => STAMPS.filter((stamp) => stamp.count <= 0),
    [STAMPS]
  );
  const hasAtLeastOneStamp = stampsYetToBeCollected.length < STAMPS.length;
  const stampsCollectedTillNow = STAMPS.length - stampsYetToBeCollected.length;
  const allStampsCollected =
    STAMPS.length > 0 && stampsYetToBeCollected.length === 0;

  const userRewardsActionsYetToBeCompleted = useMemo(
    () =>
      userRewardsResponse?.rewards.filter((action) => {
        const { perDayLimit, completedCountToday } = action.actionMetadata;
        if (perDayLimit === undefined || completedCountToday === undefined)
          return true;
        return perDayLimit !== completedCountToday;
      }),
    [userRewardsResponse?.rewards]
  );
  const allUserRewardsActionFinished =
    userRewardsActionsYetToBeCompleted?.length === 0;

  const bannerConfig = useMemo(
    () =>
      getBannerProps({
        referBannerConfig: config.referBannerConfig,
        requestBannerConfig: config.requestBannerConfig,
        upcomingEvents: festiveEvents?.upcomingEvents,
        ongoingEvent: festiveEvents?.ongoingEvent,
      }),
    [festiveEvents?.upcomingEvents, festiveEvents?.ongoingEvent]
  );

  useEffect(() => {
    const {
      locale,
      userToken,
      actionType,
      actionReferenceId,
      requestedBy,
      ...restQuery
    } = router.query;
    // INFO: This is a hack to handle data fetching delay
    handleActionInUrlQuery({
      actionType: actionType?.toString(),
      actionReferenceId: actionReferenceId?.toString(),
      requestedBy: requestedBy?.toString(),
    });
    if (!locale) {
      setIsLocaleLoading(false);
      return;
    }
    router.replace(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      {
        locale: locale.toString(),
      }
    );
    setIsLocaleLoading(false);
  }, [router.query.locale]);

  function handleActionInUrlQuery(context: {
    actionType: string | undefined;
    actionReferenceId: string | undefined;
    requestedBy: string | undefined;
  }) {
    const { actionType, actionReferenceId, requestedBy } = context;
    const _actionType =
      actionType ?? getActionTypeByReferenceId(actionReferenceId);
    if (_actionType === "STAMP_GIFT" && actionReferenceId) {
      return handleGiftClaim(actionReferenceId);
    }
    if (_actionType === "STAMP_REQUEST") {
      return handleGiftAction(actionReferenceId, requestedBy);
    }
  }

  async function handleShare(payload?: {
    imageUrl?: string;
    text?: string;
    url?: string;
  }) {
    const _defaultSharePayload = { ...config.defaultSharePayload, ...payload };
    const sharePayload = {
      imageUrls: [_defaultSharePayload.imageUrl],
      text: _defaultSharePayload.text,
      url: _defaultSharePayload.url,
    };
    const result = await shareOrClipboardCopy(sharePayload, {
      showToastOnClipboardCopy: true,
    });
    return result;
  }

  async function handleShareButtonClick(
    source: "HERO_BUTTON" | "FOOTER_BUTTON" | "STAMP_INFO_MODAL_FOOTER_BUTTON",
    payload?: { imageUrl?: string; text?: string; url?: string }
  ) {
    const result = await handleShare(payload);
    if (result.success) {
      logAnalyticsEvent(
        ["mixpanel"],
        AnalyticEvent.STAMPS_EVENT_SHARE_CLICKED,
        {
          total_stamps_collected: stampsCollectedTillNow,
          remaining_unique_stamp_count: stampsYetToBeCollected.length,
          event_type: eventType,
          share_medium: result.medium,
          source,
        }
      );
    }
  }

  function handleRouting(
    navigateTo: string | undefined,
    webviewRoute?: string
  ) {
    if (isRefyneWebview && webviewRoute) {
      return dispatchDataToNativePlatform({
        type: "ROUTE_TO_SCREEN",
        body: {
          screenName: webviewRoute,
        },
      });
    }
    if (navigateTo) {
      const navigateToWithTokenIfRequired = addUserTokenInUrlIfRequired(
        navigateTo,
        isRefyneWebview,
        idToken
      );
      const navigateToWithTokenIfRequiredWithLocale = addQueryInUrl(
        navigateToWithTokenIfRequired,
        "locale",
        router.locale
      );
      router.push(navigateToWithTokenIfRequiredWithLocale);
    }
  }

  async function handleCompleteKycClick() {
    await handleCtaClickSideEffect("COMPLETE_KYC");
    const activationUrl = `${APP_BASE_URL}/#/?next=startActivation`;
    // TODO: Check with Rahul, should we use `accountActivation`?
    handleRouting(activationUrl, "accountActivation");
  }
  async function handleInCompleteKycClick() {
    await handleCtaClickSideEffect("COMPLETE_KYC");
    const incompleteInfoUrl = `${APP_BASE_URL}/#/?next=incompleteInfo`;
    handleRouting(incompleteInfoUrl, "incompleteInfo");
  }

  async function handleCtaClickSideEffect(ctaType: "COMPLETE_KYC") {
    await logEventInMixpanelPromise(
      AnalyticEvent.STAMPS_LANDING_PAGE_CTA_CLICKED,
      {
        event_type: eventType,
        cta_type: ctaType,
      }
    );
  }

  async function handleFaqClick() {
    await logEventInMixpanelPromise(AnalyticEvent.STAMPS_FAQ_CLICKED, {
      event_type: eventType,
      total_stamps_collected: stampsCollectedTillNow,
    });
    handleRouting(config.faqUrl);
  }
  function handleReferClick() {
    const rewardsUrl = `${APP_BASE_URL}/#/?next=referral`;
    handleRouting(rewardsUrl, "invite");
  }

  function handleFestivalEndMount() {
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.STAMPS_COLLECTION_DONE_SCREEN
    );
  }
  async function handleRedeemClick() {
    await logEventInMixpanelPromise(
      AnalyticEvent.STAMPS_COLLECTION_DONE_REDEEM_CLICKED
    );
    handleReferClick();
  }

  function handleFestivalEndBannerClick() {
    if (allStampsCollected) return handleRedeemClick();
    // TODO: Any event?
    handleReferClick();
  }

  function handleHypeOnMount() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.STAMPS_LANDING_PAGE,
      {
        event_type: eventType,
        remaining_unique_stamp_count: stampsYetToBeCollected.length,
        total_stamps_collected: stampsCollectedTillNow,
        remaining_unique_stamp_name: stampsYetToBeCollected
          .map((stamp) => stamp.name)
          .join(),
        number_of_daily_actions_left:
          userRewardsActionsYetToBeCompleted?.length,
        ...(router.query.source ? { source: router.query.source } : {}),
      }
    );
  }

  function handleStampClickSideEffect(stampId: string) {
    logAnalyticsEvent(["mixpanel"], AnalyticEvent.PODIUM_STAMP_CLICKED, {
      stamp_id: stampId,
      total_stamps_collected: stampsCollectedTillNow,
      remaining_unique_stamp_count: stampsYetToBeCollected.length,
    });
  }

  function handleHypeCountdownExpiry() {
    const { autoRefreshedAfterHypeEnds, ...restQuery } = router.query;
    if (autoRefreshedAfterHypeEnds === "true") return;
    router.replace({
      pathname: router.pathname,
      query: {
        ...restQuery,
        autoRefreshedAfterHypeEnds: "true",
      },
    });
  }

  function handleStampInfoShareClick(payload: {
    imageUrl: string;
    text: string;
  }) {
    handleShareButtonClick("STAMP_INFO_MODAL_FOOTER_BUTTON", payload);
  }

  function handleBackendRedirectionDetails(redirectDetails: RedirectDetails) {
    const { screen, webViewUrl, externalUrl } = redirectDetails;
    const webviewRoute = screen;
    const navigateUrl = webViewUrl ?? externalUrl;
    handleRouting(navigateUrl, webviewRoute);
  }

  function handleStampCollectionActionShown(context: {
    actionName?: string;
    completedCount?: number;
    totalCount?: number;
  }) {
    logAnalyticsEvent(["mixpanel"], AnalyticEvent.STAMPS_ACTION_SHOWN, {
      total_stamps_collected: stampsCollectedTillNow,
      remaining_unique_stamp_count: stampsYetToBeCollected.length,
      action_name: context.actionName,
      total_count: context.totalCount,
      completed_count: context.completedCount,
    });
  }
  function handleStampCollectionActionClick(context: {
    actionName?: string;
    completedCount?: number;
    totalCount?: number;
  }) {
    logAnalyticsEvent(["mixpanel"], AnalyticEvent.STAMPS_ACTION_CLICKED, {
      total_stamps_collected: stampsCollectedTillNow,
      remaining_unique_stamp_count: stampsYetToBeCollected.length,
      action_name: context.actionName,
      total_count: context.totalCount,
      completed_count: context.completedCount,
    });
  }

  function handleError(error: any, source?: string) {
    const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
    if (!errorMessage) return;
    toast.error(errorMessage);
  }

  function openStampEarnedModalByStampId(
    stampId: string,
    source: "happy_hour" | "stamp_received_from_gifter"
  ) {
    const stampInfo = getStampInfoFromConfigById(
      config.rewardIdToStampsConfigMap,
      stampId
    );
    if (!stampInfo) return;

    logAnalyticsEvent(["mixpanel"], AnalyticEvent.STAMPS_BOTTOM_SHEET_SHOWN, {
      bottom_sheet_type: source,
      total_stamps_collected: stampsCollectedTillNow,
      remaining_unique_stamp_count: stampsYetToBeCollected.length,
      stamp_id: stampId,
    });

    const title = "Woohoo - Stamp delivered! 🤩";
    const description =
      "You can collect more stamps and win rewards by clicking here";
    setStampInfoModalContent({
      stampId,
      illustrationUrl: stampInfo.info?.illustrationUrl,
      title,
      description,
    });
  }

  function handleBannerOnMount() {
    if (!bannerConfig) return;
    logAnalyticsEvent(["mixpanel"], AnalyticEvent.STAMPS_BANNER_SHOWN, {
      banner_type: bannerConfig.type,
      total_stamps_collected: stampsCollectedTillNow,
      remaining_unique_stamp_count: stampsYetToBeCollected.length,
    });
  }

  async function handleBannerClick() {
    if (!bannerConfig) return;
    const { type, bannerRewardId, bannerProps } = bannerConfig;
    await logEventInMixpanelPromise(AnalyticEvent.STAMPS_BANNER_CLICKED, {
      banner_type: bannerConfig.type,
      total_stamps_collected: stampsCollectedTillNow,
      remaining_unique_stamp_count: stampsYetToBeCollected.length,
    });
    if (type === "REQUEST_BANNER") return handleRequestClick("REQUEST_BANNER");
    if (type === "REFER_BANNER") return handleReferClick();
    if (type === "PRE_HAPPY_HOURS_BANNER") {
      return router.reload();
    }
    if (type === "ONGOING_HAPPY_HOURS_BANNER" && bannerRewardId) {
      try {
        const response = await claimFestiveEvent(bannerRewardId);
        const stampId = response?.wonRewardSnapshot._id;
        if (!stampId) return;
        openStampEarnedModalByStampId(stampId, "happy_hour");
      } catch (error) {
        handleError(error);
      }
      return;
    }
    if (bannerProps?.onClickFromServer) {
      return handleBackendRedirectionDetails(bannerProps.onClickFromServer);
    }
  }

  function handleStampSelectionChange(stampId: string, requestId?: string) {
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.STAMPS_SELECTED_IN_GIFT_BOTTOM_SHEET,
      {
        type: requestId ? "known" : "unknown",
        remaining_unique_stamp_count: stampsYetToBeCollected.length,
        stamp_id: stampId,
        total_stamps_collected: stampsCollectedTillNow,
      }
    );
  }

  // Gifting Start
  function handleStampGiftModalClose() {
    setStampGiftModalContext(null);
  }
  function handleGiftAction(requestId?: string, requestedBy?: string) {
    const requesterName = requestId ? requestedBy ?? "Your friend" : null;
    // TODO: Discuss with Priyam
    const description = requesterName
      ? `${requesterName} is requesting a stamp`
      : "You can gift one of the stamp to your co-workers, at a time";
    setStampGiftModalContext({
      requestId,
      title: "Tap on a stamp to gift",
      description,
    });
  }
  function handleGiftCtaClick() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.STAMPS_PAGE_GIFT_CLICKED,
      {
        total_stamps_collected: stampsCollectedTillNow,
        remaining_unique_stamp_count: stampsYetToBeCollected.length,
      }
    );
    handleGiftAction();
  }
  async function handleGiftModalPrimaryCtaClick(context: {
    stampId: string;
    stampName?: string;
    requestId?: string;
  }) {
    handleStampGiftModalClose();
    const { stampId, stampName, requestId } = context;
    await logEventInMixpanelPromise(AnalyticEvent.STAMPS_GIFT_ATTEMPTED, {
      type: requestId ? "known" : "unknown",
      stamp_id: stampId,
      total_stamps_collected: stampsCollectedTillNow,
      remaining_unique_stamp_count: stampsYetToBeCollected.length,
    });
    try {
      if (requestId) {
        await giftVirtualReward(requestId, stampId);
        toast.success("Gifting Successful");
        return refetchVirtualRewards(false);
      }
      const giftLinkResponse = await generateVirtualRewardGiftLink(stampId);
      if (!giftLinkResponse) throw new Error("Failed to Gift");
      const giftShareMessage = config.giftShareContent.message.replace(
        "{{stampName}}",
        stampName ?? "Refyne"
      );
      const stampInfo = getStampInfoFromConfigById(
        config.rewardIdToStampsConfigMap,
        stampId
      );
      const giftSharePayload = {
        imageUrl: stampInfo?.info?.illustrationUrl,
        text: giftShareMessage,
        url: giftLinkResponse.giftingLink,
      };
      await handleShare(giftSharePayload);
    } catch (error) {
      handleError(error);
    }
  }
  async function handleGiftClaim(giftId: string) {
    try {
      const response = await claimVirtualRewardGift(giftId);
      if (!response) return;
      openStampEarnedModalByStampId(
        response.wonRewardId,
        "stamp_received_from_gifter"
      );
    } catch (error) {
      handleError(error);
    }
  }
  // Gifting End

  // Request Start
  function getRequestStampNames() {
    if (
      stampsYetToBeCollected.length === 0 ||
      stampsYetToBeCollected.length > 3
    )
      return "Refyne";
    return stampsYetToBeCollected
      .map((stamp) => stamp.name)
      .filter(Boolean)
      .join(", ");
  }
  async function handleRequestClick(
    source: "HERO_BUTTON" | "MODAL_BUTTON" | "REQUEST_BANNER"
  ) {
    try {
      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.STAMPS_PAGE_REQUEST_CLICKED,
        {
          total_stamps_collected: stampsCollectedTillNow,
          remaining_unique_stamp_count: stampsYetToBeCollected.length,
          source,
        }
      );
      const requestLinkResponse = await generateVirtualRewardRequestLink();
      if (!requestLinkResponse)
        throw new Error("Failed to request, try after sometime");
      const requestShareMessage = config.requestShareContent.message.replace(
        "{{stampNames}}",
        getRequestStampNames()
      );
      const requestSharePayload = {
        text: requestShareMessage,
        url: requestLinkResponse.requestingLink,
      };
      await handleShare(requestSharePayload);
    } catch (error) {
      handleError(error);
    }
  }
  // Request End

  // Stamp Received via Gift
  function handleStampInfoModalClose() {
    setStampInfoModalContent(null);
    refetchVirtualRewards(false);
  }
  async function handleStampInfoModalShareClick(
    sharePayload: {
      imageUrl: string;
      text: string;
    },
    context: {
      stampId?: string;
    }
  ) {
    await logEventInMixpanelPromise(
      AnalyticEvent.STAMPS_BOTTOM_SHEET_CTA_CLICKED,
      {
        cta_type: "SHARE",
        stamp_id: context.stampId,
        total_stamps_collected: stampsCollectedTillNow,
        remaining_unique_stamp_count: stampsYetToBeCollected.length,
      }
    );
    handleStampInfoModalClose();
    handleShare(sharePayload);
  }

  if (isLocaleLoading || !userStatus) return null;

  if (
    isFestiveEventsFetching ||
    isUserRewardsFetching ||
    isVirtualRewardsFetching
  )
    return <LoadingPage />;

  if (isHypeCreationDay)
    return (
      <VirtualRewardsEventHype
        onMount={handleHypeOnMount}
        userStatus={userStatus}
        remainingTimeInSecForFestivalToStart={
          remainingTimeInSecForFestivalToStart
        }
        gameRules={config.rules}
        socialProofTexts={config.socialProofTexts}
        isShareLoading={shareInProgress}
        heroElementTextColor={
          config.hypeCreationPageConfig.heroElementTextColor
        }
        heroBackgroundImageUrl={
          config.hypeCreationPageConfig.heroBackgroundImageUrl
        }
        heroElementHeight={config.hypeCreationPageConfig.heroBackgroundHeight}
        heroFooterBackgroundColor={
          config.hypeCreationPageConfig.heroFooterBackgroundColor
        }
        onCompleteKycClick={handleCompleteKycClick}
        onIncompleteKycClick={handleInCompleteKycClick}
        onShareClick={handleShareButtonClick}
        onFaqClick={handleFaqClick}
        onCountdownFinish={handleHypeCountdownExpiry}
      />
    );

  if (userStatus !== UserStatus.REFYNE_VERIFIED) {
    return (
      <VirtualRewardsEventRegular
        onMount={handleHypeOnMount}
        userStatus={userStatus}
        gameRules={config.rules}
        gameRuleVideoUrl={config.faqVideoUrl}
        canGiftAndRequest={false}
        canShare={false}
        isGiftingEnabled={false}
        stamps={STAMPS}
        stampCountBorderColor={config.stampCountBorderColor}
        stampCountDisplayPosition={
          config.stampCountDisplayPosition as StampCountPosition
        }
        stampPodiumStageHasBottomBorder={
          config.podiumStagesConfig.hasBottomBorder
        }
        stampPodiumStages={config.podiumStagesConfig.stages}
        stampPodiumBackground={config.podiumStagesConfig.stampPodiumBackground}
        stampPodiumBorder={config.podiumStagesConfig.stampPodiumBorder}
        heroBackgroundRiveUrl={
          config.festiveDaysPageConfig.heroBackgroundRiveUrl
        }
        heroBackgroundImageUrl={
          config.festiveDaysPageConfig.heroBackgroundImageUrl
        }
        heroElementHeight={config.festiveDaysPageConfig.heroBackgroundHeight}
        heroElementTextColor={config.festiveDaysPageConfig.heroElementTextColor}
        heroFooterBackgroundColor={
          config.festiveDaysPageConfig.heroFooterBackgroundColor
        }
        socialProofTexts={config.socialProofTexts}
        isShareLoading={shareInProgress}
        onCompleteKycClick={handleCompleteKycClick}
        onIncompleteKycClick={handleInCompleteKycClick}
        onShareClick={handleShareButtonClick}
        onFaqClick={handleFaqClick}
      />
    );
  }

  const isInWebviewExceptRefyne = isWebview() && !isRefyneWebview;
  const canGiftAndRequest = !isInWebviewExceptRefyne;

  const isRequestEnabled = !allStampsCollected;
  const isGiftingEnabled = hasAtLeastOneStamp;
  const bannerProps = bannerConfig?.bannerProps
    ? {
        ...bannerConfig.bannerProps,
        onClick: handleBannerClick,
      }
    : undefined;

  // TODO: Adding false here for now, will figure out this
  if (isFestivalEnded || allStampsCollected) {
    const heroElementText = allStampsCollected
      ? config.finishedPageConfig.fullyFinishedHeroElementText
      : config.finishedPageConfig.partiallyFinishedHeroElementText;
    const finishedSocialProofText = allStampsCollected
      ? "refyne_marathon_timeout_social_proof"
      : "refyne_marathon_winner_social_proof";
    const heroBackgroundProps = allStampsCollected
      ? {
          heroBackgroundImageUrl:
            config.finishedPageConfig.fullyFinishedHeroBackgroundImageUrl,
          heroElementHeight:
            config.finishedPageConfig.fullyFinishedHeroBackgroundHeight,
        }
      : {
          heroBackgroundImageUrl:
            config.finishedPageConfig.partiallyFinishedHeroBackgroundImageUrl,
          heroElementHeight:
            config.finishedPageConfig.partiallyFinishedHeroBackgroundHeight,
        };
    const heroElementIllustrationUrl = allStampsCollected
      ? config.finishedPageConfig.fullyFinishedHeroElementIllustrationUrl
      : undefined;

    // TODO: Add banner config
    const banner: BannerProps = allStampsCollected
      ? config.finishedPageConfig.fullyFinishedBanner
      : config.finishedPageConfig.partiallyFinishedBanner;
    return (
      <VirtualRewardsEventEnd
        heroElementText={heroElementText}
        heroElementTextColor={config.finishedPageConfig.heroElementTextColor}
        {...heroBackgroundProps}
        heroFooterBackgroundColor={
          config.finishedPageConfig.heroFooterBackgroundColor
        }
        heroElementIllustrationUrl={heroElementIllustrationUrl}
        stamps={STAMPS}
        stampsCollected={stampsCollectedTillNow}
        stampCountBorderColor={config.stampCountBorderColor}
        stampCountDisplayPosition={
          config.stampCountDisplayPosition as StampCountPosition
        }
        stampPodiumStageHasBottomBorder={
          config.podiumStagesConfig.hasBottomBorder
        }
        stampPodiumStages={config.podiumStagesConfig.stages}
        socialProofText={finishedSocialProofText}
        banner={banner}
        onMount={handleFestivalEndMount}
        onBannerClick={handleFestivalEndBannerClick}
      />
    );
  }

  return (
    <>
      <VirtualRewardsEventRegular
        onMount={handleHypeOnMount}
        userStatus={userStatus}
        gameRules={config.rules}
        gameRuleVideoUrl={config.faqVideoUrl}
        // TODO: Move them to config
        canGiftAndRequest={canGiftAndRequest}
        canShare={true}
        isGiftingEnabled={isGiftingEnabled}
        isRequestEnabled={isRequestEnabled}
        stamps={STAMPS}
        stampCountBorderColor={config.stampCountBorderColor}
        stampCountDisplayPosition={
          config.stampCountDisplayPosition as StampCountPosition
        }
        stampPodiumStageHasBottomBorder={
          config.podiumStagesConfig.hasBottomBorder
        }
        stampPodiumStages={config.podiumStagesConfig.stages}
        stampPodiumBackground={config.podiumStagesConfig.stampPodiumBackground}
        stampPodiumBorder={config.podiumStagesConfig.stampPodiumBorder}
        heroBackgroundRiveUrl={
          config.festiveDaysPageConfig.heroBackgroundRiveUrl
        }
        heroBackgroundImageUrl={
          config.festiveDaysPageConfig.heroBackgroundImageUrl
        }
        heroElementHeight={config.festiveDaysPageConfig.heroBackgroundHeight}
        heroElementTextColor={config.festiveDaysPageConfig.heroElementTextColor}
        heroFooterBackgroundColor={
          config.festiveDaysPageConfig.heroFooterBackgroundColor
        }
        socialProofTexts={config.socialProofTexts}
        isShareLoading={shareInProgress}
        stampCollectionActions={userRewardsResponse?.rewards}
        allStampCollectionActionsCompleted={allUserRewardsActionFinished}
        banner={bannerProps}
        onBannerMount={handleBannerOnMount}
        onCompleteKycClick={handleCompleteKycClick}
        onIncompleteKycClick={handleInCompleteKycClick}
        onShareClick={handleShareButtonClick}
        onFaqClick={handleFaqClick}
        onGiftCtaClick={handleGiftCtaClick}
        onStampInfoShareClick={handleStampInfoShareClick}
        onRequestCtaClick={handleRequestClick}
        onStampCollectionActionRouting={handleBackendRedirectionDetails}
        onStampCollectionActionShown={handleStampCollectionActionShown}
        onStampCollectionActionClick={handleStampCollectionActionClick}
        onReferCtaClick={handleReferClick}
        onStampClick={handleStampClickSideEffect}
      />
      <Modal
        active={stampGiftModalContext !== null}
        bottomSheetOnMobile
        onClose={handleStampGiftModalClose}
      >
        {stampGiftModalContext && (
          <StampSelectionCard
            {...stampGiftModalContext}
            stamps={STAMPS}
            primaryCtaLabel="Gift Stamp"
            onPrimaryCtaClick={handleGiftModalPrimaryCtaClick}
            onStampSelectionChange={handleStampSelectionChange}
          />
        )}
      </Modal>
      <Modal
        active={stampInfoModalContent !== null}
        onClose={handleStampInfoModalClose}
        bottomSheetOnMobile
      >
        <StampInfoCard
          {...stampInfoModalContent}
          onShareClick={(payload) =>
            handleStampInfoModalShareClick(payload, {
              stampId: stampInfoModalContent?.stampId,
            })
          }
          hasRequest={false}
        />
      </Modal>
    </>
  );
}

function getBannerProps(context: {
  requestBannerConfig?: BannerProps | null;
  referBannerConfig?: BannerProps | null;
  upcomingEvents?: FestiveEventConfig[];
  ongoingEvent?: FestiveEventConfig;
}): {
  type:
    | "REQUEST_BANNER"
    | "REFER_BANNER"
    | "PRE_HAPPY_HOURS_BANNER"
    | "ONGOING_HAPPY_HOURS_BANNER";
  bannerRewardId?: string;
  bannerProps:
    | (Partial<BannerWithCountdownCtaProps> & {
        onClickFromServer?: RedirectDetails;
      })
    | undefined
    | null;
} | null {
  const {
    requestBannerConfig,
    referBannerConfig,
    upcomingEvents,
    ongoingEvent,
  } = context;
  const today = new Date();
  if (ongoingEvent) {
    const { rewardId, endDate, uiMetadata } = ongoingEvent;
    const diff = differenceInSeconds(new Date(endDate), today);
    return {
      type: "ONGOING_HAPPY_HOURS_BANNER",
      bannerRewardId: rewardId,
      bannerProps: {
        heading: uiMetadata.header?.text.toLowerCase(),
        headingColor: "var(--clr-text-primary)",
        description: uiMetadata.description?.text.toLowerCase(),
        descriptionColor: "var(--clr-text-secondary)",
        rightImageUrl: uiMetadata.imageUrl,
        backgroundColor: "var(--clr-info-success-light)",
        ctaLabel: "End in",
        ctaLabelColor: "var(--clr-brand-default)",
        ctaBackgroundColor: "var(--clr-info-success-light)",
        countdownForInSec: diff,
        onClickFromServer: uiMetadata.onClick,
      },
    };
  }
  if (upcomingEvents) {
    const latestUpcomingEvent = upcomingEvents[0];
    if (latestUpcomingEvent) {
      const { rewardId, startDate, uiMetadata } = latestUpcomingEvent;
      const diff = differenceInSeconds(new Date(startDate), today);
      if (diff < ONE_HOUR_IN_SEC) {
        return {
          type: "PRE_HAPPY_HOURS_BANNER",
          bannerRewardId: rewardId,
          bannerProps: {
            heading: uiMetadata.header?.text.toLowerCase(),
            headingColor: "var(--clr-text-primary)",
            description: uiMetadata.description?.text.toLowerCase(),
            descriptionColor: "var(--clr-text-secondary)",
            backgroundColor: "#EBF5FF",
            ctaBackgroundColor: "#EBF5FF",
            rightImageUrl: uiMetadata.imageUrl,
            ctaLabel: "Starts in",
            ctaLabelAfterCountdownFinished: "Start",
            ctaLabelColor: "var(--clr-text-primary)",
            ctaDisabledTillCountdownFinish: true,
            countdownForInSec: diff,
            onClickFromServer: uiMetadata.onClick,
          },
        };
      }
    }
  }
  if (requestBannerConfig)
    return { type: "REQUEST_BANNER", bannerProps: requestBannerConfig };
  return { type: "REFER_BANNER", bannerProps: referBannerConfig };
}
