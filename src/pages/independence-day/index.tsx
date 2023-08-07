import { useEffect, useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import IndependenceDayHype from "@/components/IndependenceDay/IndependenceDayHype";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import config from "../../../data/ids_config.json";
import { useShare } from "@/hooks/useShare";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { useRouter } from "next/router";
import { APP_BASE_URL } from "@/constants";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanelPromise } from "@/lib/analytics/mixpanel";
import { isIOS } from "@/lib/utils";

const TOTAL_STAMP_TO_BE_COLLECTED = 6;

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

interface ServerSideResponse {
  isHypeCreationDay: boolean;
  remainingTimeInSecForFestivalToStart: number;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideResponse
> = async () => {
  const festivalStart = new Date(config.festiveStartDate);
  const today = new Date();

  const remainingTimeInMsForFestivalToStart = Math.max(
    festivalStart.getTime() - today.getTime(),
    0
  );
  const remainingTimeInSecForFestivalToStart = Math.floor(
    remainingTimeInMsForFestivalToStart / 1000
  );
  const isHypeCreationDay = remainingTimeInMsForFestivalToStart > 0;

  return { props: { isHypeCreationDay, remainingTimeInSecForFestivalToStart } };
};

export default function IndependenceDayTrailerLandingPage({
  isHypeCreationDay,
  remainingTimeInSecForFestivalToStart,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const userStatus = getValueFromMetadata("status");
  const idToken = getValueFromMetadata("idToken");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);

  const router = useRouter();
  const [isLocaleLoading, setIsLocaleLoading] = useState<boolean>(true);
  const { shareInProgress, shareOrClipboardCopy } = useShare({
    isNativePlatformShareSupported: isRefyneWebview && !isIOS(),
  });

  useEffect(() => {
    const { locale, userToken, ...restQuery } = router.query;
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

  async function handleShare(source: "HERO_BUTTON" | "FOOTER_BUTTON") {
    const sharePayload = {
      imageUrls: [config.defaultSharePayload.imageUrl],
      text: config.defaultSharePayload.text,
      url: config.defaultSharePayload.url,
    };
    const result = await shareOrClipboardCopy(sharePayload, {
      showToastOnClipboardCopy: true,
    });
    if (result.success) {
      logAnalyticsEvent(
        ["mixpanel"],
        AnalyticEvent.STAMPS_EVENT_SHARE_CLICKED,
        {
          total_stamps_collected: 0,
          event_type: "hype_creation",
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
        event_type: "hype_creation",
        cta_type: ctaType,
      }
    );
  }

  async function handleFaqClick() {
    await logEventInMixpanelPromise(AnalyticEvent.STAMPS_FAQ_CLICKED, {
      event_type: "hype_creation",
      total_stamps_collected: 0,
    });
    handleRouting(config.faqUrl);
  }

  function handleHypeOnMount() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.STAMPS_LANDING_PAGE,
      {
        event_type: "hype_creation",
        remaining_unique_stamp_count: TOTAL_STAMP_TO_BE_COLLECTED,
        total_stamps_collected: 0,
      }
    );
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

  if (isLocaleLoading || !userStatus) return null;

  if (isHypeCreationDay)
    return (
      <IndependenceDayHype
        onMount={handleHypeOnMount}
        userStatus={userStatus}
        remainingTimeInSecForFestivalToStart={
          remainingTimeInSecForFestivalToStart
        }
        gameRules={config.rules}
        socialProofTexts={config.socialProofTexts}
        isShareLoading={shareInProgress}
        onCompleteKycClick={handleCompleteKycClick}
        onIncompleteKycClick={handleInCompleteKycClick}
        onShareClick={handleShare}
        onFaqClick={handleFaqClick}
        onCountdownFinish={handleHypeCountdownExpiry}
      />
    );

  return <div>Coming Soon</div>;
}
