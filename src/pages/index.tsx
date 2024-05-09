import Banner, { BannerProps } from "@/components/Banner";
import Carousel from "@/components/Carousel";
import CreditScoreWidget from "@/components/CreditReport/CreditScoreWidget";
import LoadingPage from "@/components/LoadingPage";
import PageLayout from "@/components/PageLayout";
import FeaturedShort from "@/components/Shorts/FeaturedShort";
import { ScreenName } from "@/constants/ScreenName";
import useFetcher from "@/hooks/useFetcher";
import { useSurveyTrigger } from "@/hooks/useSurveyTrigger";
import useTranslation from "@/hooks/useTranslation";
import rightArrowIconUrl from "@/images/right-arrow.svg";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { hasWatchedIntroduction } from "@/lib/core";
import {
  ReleaseConfig,
  checkIfFeatureEnabledByReleaseConfig,
} from "@/lib/core/release-config";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { fetcher } from "@/lib/fetcher";
import { SurveyTriggerAction } from "@/lib/survey";
import constructElementId from "@/lib/utils/constructElementId";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useState } from "react";
import config from "../../data/landing_page.json";
import { ShortsResponse } from "./api/shorts";

enum DashboardComponent {
  R_SHORT_CAROUSEL = "R_SHORT_CAROUSEL",
  FIN_TOOLS = "FIN_TOOLS",
  STICKY_BANNERS = "STICKY_BANNERS",
  CAROUSEL_BANNERS = "CAROUSEL_BANNERS",
  CREDIT_SCORE_WIDGET = "CREDIT_SCORE_WIDGET",

  // Temp
  IMAGE_BANNER = "IMAGE_BANNER",
}

const DEFAULT_COMPONENTS_ORDER_FALLBACK: Array<DashboardComponent> = [
  DashboardComponent.R_SHORT_CAROUSEL,
  DashboardComponent.STICKY_BANNERS,
  DashboardComponent.FIN_TOOLS,
  DashboardComponent.CAROUSEL_BANNERS,
];

export default function HomePage() {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatchAction } = useSurveyTrigger();

  const { data, isLoading: isLoadingShorts } = useFetcher(() => {
    return fetcher<ShortsResponse>("/api/shorts");
  });

  const shorts = data?.data.data ?? [];

  const featuredShortCarouselAutoPlayDuration: number | undefined =
    config.featuredShort?.autoPlayDurationInMs;

  const router = useRouter();

  const _carouselBanners: Array<
    BannerProps & { name: string; releaseConfig?: ReleaseConfig }
  > | null = config?.carouselBanner?.banners ?? null;
  const carouselBannerAutoPlayDurationInMs: number | undefined =
    config?.carouselBanner?.autoPlayDurationInMs;

  useEffect(() => {
    if (!hasWatchedIntroduction()) {
      router.replace({
        pathname: "/introduction",
        query: router.query,
      });
      return;
    }
    const navigateToShortId = router.query["short-id"];
    if (navigateToShortId) {
      // Cleanup short-id for back click
      router.replace(
        {
          pathname: router.pathname,
        },
        undefined,
        {
          shallow: true,
        }
      );

      router.push({
        pathname: "/shorts",
        hash: navigateToShortId.toString(),
      });
      return;
    }

    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.FIN_LITERACY_DASHBOARD_SCREEN
    );
    dispatchAction(SurveyTriggerAction.MONEY_GURU_DASHBOARD_OPEN);

    // NEXTjs hack!
    setIsMounted(true);
  }, []);

  function setLoadingWithTimeoutToReset(state: boolean) {
    setIsLoading(state);
    // INFO: Have to add this due to Next.js browser back not resetting state issue
    setTimeout(() => setIsLoading(!state), 5000);
  }

  const isWebviewInsideRefyneApp = isCurrentlyOnRefyneWebview(
    getValueFromMetadata("appPlatformName")
  );

  const idToken = getValueFromMetadata("idToken");
  const userId = getValueFromMetadata("id");
  const employerId = getValueFromMetadata("employerId");
  const workerId = getValueFromMetadata("workerId");

  function handleFinToolClick(name: string, url: string) {
    setLoadingWithTimeoutToReset(true);
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.FIN_LITERACY_TOOLS_CLICKED,
      {
        tool_name: name,
      }
    );

    const _url = url
      .replace("{userId}", userId ?? "")
      .replace("{idToken}", idToken ?? "");
    router.push(_url);
  }

  function handleBannerClick(name: string) {
    setLoadingWithTimeoutToReset(true);
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_BANNER_CLICKED, {
      name,
    });
  }

  function handleCarouselBannerClick(
    name: string,
    bannerType: "carousel" | "experiment"
  ) {
    return () => {
      logEventInMixpanel(AnalyticEvent.FIN_LITERACY_BANNER_CLICKED, {
        banner_type: bannerType,
        name,
      });
    };
  }

  function handleFeaturedShortClick(id: string) {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.R_SHORTS_OPENED,
      {
        short_id: id,
      }
    );
    router.push({
      pathname: "/shorts",
      hash: id,
    });
  }

  const finLiteracyTools = useMemo(
    () =>
      config.finLiteracyTools.filter((tool: any) => {
        const releaseConfigs = tool.releaseConfigs;
        if (!Array.isArray(releaseConfigs)) return true;
        return releaseConfigs.some((releaseConfig) =>
          checkIfFeatureEnabledByReleaseConfig(releaseConfig, {
            employerId,
            workerId,
          })
        );
      }),
    [config.finLiteracyTools, employerId, workerId]
  );

  const stickyBanners = config.stickyBanners.filter((banner: any) =>
    checkIfFeatureEnabledByReleaseConfig(banner.releaseConfig, {
      employerId,
      workerId,
    })
  );
  const hasStickyBanners = stickyBanners.length > 0;

  const carouselBanners = _carouselBanners?.filter((banner) => {
    if (!banner.releaseConfig) return true;
    return checkIfFeatureEnabledByReleaseConfig(banner.releaseConfig, {
      employerId,
      workerId,
    });
  });
  const hasCarouselBanners = carouselBanners.length > 0;

  const imageBanner = useMemo<Record<string, any>>(() => {
    const applicableBanners = config.imagesBannerConfig.banners.filter(
      (banner: any) => {
        if (!banner.releaseConfig) return true;
        return checkIfFeatureEnabledByReleaseConfig(banner.releaseConfig, {
          employerId,
          userId,
        });
      }
    );
    return applicableBanners[0] ?? null;
  }, []);

  const isCreditScoreWidgetToBeShown = useMemo<boolean>(() => {
    const releaseConfig = config.creditScoreWidgetConfig.releaseConfig;
    return checkIfFeatureEnabledByReleaseConfig(releaseConfig, {
      employerId,
      workerId,
      userId,
    });
  }, []);

  const componentsOrder = useMemo<DashboardComponent[]>(() => {
    const componentsOrderConfig = config.componentsOrderConfig.find(
      (order: any) => {
        return checkIfFeatureEnabledByReleaseConfig(order.releaseConfigs, {
          employerId,
          workerId,
        });
      }
    );
    if (!componentsOrderConfig) return DEFAULT_COMPONENTS_ORDER_FALLBACK;
    return componentsOrderConfig.order as DashboardComponent[];
  }, [config.componentsOrderConfig]);

  if (!isMounted || isLoading || isLoadingShorts) return <LoadingPage />;

  console.log(shorts);

  const COMPONENTS_NAME_TO_ELEMENT_MAP: Record<
    DashboardComponent,
    ReactElement | null
  > = {
    R_SHORT_CAROUSEL: (
      <Carousel
        autoPlay={!!featuredShortCarouselAutoPlayDuration}
        infiniteLoop
        interval={featuredShortCarouselAutoPlayDuration}
        showIndicators={shorts.length > 1}
      >
        {shorts.map((shortItem) => {
          return (
            <div key={shortItem.id} className="mb-8">
              <FeaturedShort
                mediaType={(shortItem.metadata?.mediaType ?? "") as string}
                mediaUrl={(shortItem.metadata?.mediaUrl ?? "") as string}
                tag={(shortItem.metadata?.tag ?? "") as string}
                onClick={() => handleFeaturedShortClick(shortItem.id)}
                ctaLabel={t("read_more")}
              >
                <article
                  dangerouslySetInnerHTML={{
                    __html: marked(shortItem.content),
                  }}
                />
              </FeaturedShort>
            </div>
          );
        })}
      </Carousel>
    ),
    STICKY_BANNERS: hasStickyBanners ? (
      <>
        {stickyBanners.map((banner: any, index) => (
          <a
            key={index}
            className="unstyled-link"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--spacing-3) 0",
              borderTop: "1px solid #E5EEF8",
              borderBottom: "1px solid #E5EEF8",
              textDecoration: "none",
            }}
            href={banner.href}
            onClick={() => handleBannerClick(banner.name)}
          >
            <figure
              style={{
                width: "3.2rem",
                height: "3.2rem",
                marginRight: "var(--spacing-3)",
              }}
            >
              <img src={banner.leftIconUrl} alt={banner.label} />
            </figure>
            <p
              className="text-caption"
              dangerouslySetInnerHTML={{
                __html: tWithoutTypeSafety(banner.label),
              }}
              style={{
                flexGrow: 1,
                marginRight: "var(--spacing-2)",
              }}
            />
            <Image src={rightArrowIconUrl} alt="right arrow icon" />
          </a>
        ))}
      </>
    ) : null,
    FIN_TOOLS: (
      <>
        <h3 className="clr-text-secondary mb-3">{t("tools")}</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: "1.6rem",
            rowGap: "1.6rem",
          }}
        >
          {finLiteracyTools.map((tool, index) => (
            <div
              key={index}
              id={constructElementId({
                screenName: ScreenName.MONGU_DASHBOARD,
                elementName: "FIN_TOOLS",
                elementId: tool.name,
              })}
              style={{
                backgroundColor: tool.backgroundColor,
                borderRadius: "0.8rem",
                padding: "0.8rem",
                cursor: "pointer",
              }}
              role="button"
              onClick={() => handleFinToolClick(tool.name, tool.url)}
            >
              <figure>
                <img src={tool.iconUrl} alt={tool.title} />
              </figure>
              <p
                className="text-caption mt-4"
                dangerouslySetInnerHTML={{
                  __html: tWithoutTypeSafety(tool.title),
                }}
              />
            </div>
          ))}
        </div>
      </>
    ),
    CAROUSEL_BANNERS: hasCarouselBanners ? (
      <div className={`${carouselBanners.length > 1 ? "px-0" : ""}`}>
        <Carousel
          autoPlay={!!carouselBannerAutoPlayDurationInMs}
          infiniteLoop
          centerMode
          centerSlidePercentage={90}
          interval={carouselBannerAutoPlayDurationInMs}
        >
          {carouselBanners.map((banner, index) => (
            <Banner
              key={index}
              {...banner}
              heading={banner.heading && tWithoutTypeSafety(banner.heading)}
              description={
                banner.description && tWithoutTypeSafety(banner.description)
              }
              ctaLabel={banner.ctaLabel && tWithoutTypeSafety(banner.ctaLabel)}
              hasHorizontalMargin={carouselBanners.length > 1}
              onClick={handleCarouselBannerClick(banner.name, "carousel")}
            />
          ))}
        </Carousel>
      </div>
    ) : null,
    IMAGE_BANNER: imageBanner ? (
      <div>
        <Link
          href={imageBanner.url}
          onClick={handleCarouselBannerClick(imageBanner.name, "experiment")}
        >
          <figure>
            <img
              src={imageBanner.imageUrl}
              alt="Money Guru"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </figure>
        </Link>
      </div>
    ) : null,
    CREDIT_SCORE_WIDGET: isCreditScoreWidgetToBeShown ? (
      <CreditScoreWidget screen="DASHBOARD" />
    ) : null,
  };

  return (
    <PageLayout
      navbarText="Money Guru"
      navbarBackground="radial-gradient(88.74% 79.73% at 7.22% 22.15%, #FFF 0%, #EBF5FF 100%)"
      hasContentPadding
      dispatchPopEventOnBackClick={isWebviewInsideRefyneApp}
    >
      {componentsOrder.map((componentName, index) => {
        const Elem = COMPONENTS_NAME_TO_ELEMENT_MAP[componentName];
        if (Elem === null) return null;
        const elementId = constructElementId({
          screenName: ScreenName.MONGU_DASHBOARD,
          elementName: componentName,
        });
        return (
          <div
            key={componentName + index}
            id={elementId}
            className="dashboard-contents-container"
          >
            {Elem}
          </div>
        );
      })}
    </PageLayout>
  );
}
