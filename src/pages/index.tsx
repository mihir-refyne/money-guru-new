import Banner, { BannerProps } from "@/components/Banner";
import CalculatorTiles from "@/components/CalculatorTiles";
import Carousel from "@/components/Carousel";
import DashboardLoader from "@/components/DashboardLoader";
import LearningModulePreview from "@/components/LearningModule/LearningModulePreview";
import PageLayout from "@/components/PageLayout";
import SegmentedControl from "@/components/SegmentedControl";
import FeaturedShort from "@/components/Shorts/FeaturedShort";
import TrackerTileWrapper from "@/components/TrackerTile/TrackerTileWrapper";
import { ScreenName } from "@/constants/ScreenName";
import useFetcher from "@/hooks/useFetcher";
import { useSurveyTrigger } from "@/hooks/useSurveyTrigger";
import useTranslation from "@/hooks/useTranslation";
import rightArrowIconUrl from "@/images/right-arrow.svg";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { hasWatchedIntroduction } from "@/lib/core";
import {
  ReleaseConfig,
  checkIfFeatureEnabledByReleaseConfig,
} from "@/lib/core/release-config";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { fetcher } from "@/lib/fetcher";
import { getShortsByLocale } from "@/lib/shorts/server";
import { SurveyTriggerAction } from "@/lib/survey";
import constructElementId from "@/lib/utils/constructElementId";
import {
  fetchLearningModules,
  LearningModuleType,
} from "@/lib/utils/learningModulesFetcher";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useState } from "react";
import config from "../../data/landing_page.json";
import { ShortsResponse } from "./api/shorts";

// Banner-style sections only — these still render above the Learn/Tools
// switcher in whatever order componentsOrderConfig configures. News
// (R_SHORT_CAROUSEL), trackers (PF/credit score/coaching) and calculators
// moved into the Learn/Tools sides below and are no longer part of this
// flat, orderable list.
enum DashboardComponent {
  STICKY_BANNERS = "STICKY_BANNERS",
  CAROUSEL_BANNERS = "CAROUSEL_BANNERS",

  // Temp
  IMAGE_BANNER = "IMAGE_BANNER",
}

const DEFAULT_COMPONENTS_ORDER_FALLBACK: Array<DashboardComponent> = [
  DashboardComponent.STICKY_BANNERS,
  DashboardComponent.CAROUSEL_BANNERS,
  DashboardComponent.IMAGE_BANNER,
];

type MoneyGuruSide = "learn" | "tools";
const DEFAULT_SIDE: MoneyGuruSide = "learn";

export default function HomePage({ shorts: oldShorts }: HomePageProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatchAction } = useSurveyTrigger();

  const { data, isLoading: isLoadingShorts } = useFetcher(() => {
    return fetcher<ShortsResponse>("/api/shorts");
  });

  const shorts = data?.data.data ?? [];

  const { data: learningModulesData, isLoading: isLoadingLearningModules } =
    useFetcher(async () => {
      const result = await fetchLearningModules();
      if ("error" in result) throw new Error(result.error);
      return result.data;
    });
  const learningModules: Array<LearningModuleType> =
    learningModulesData?.modules ?? [];

  const featuredShortCarouselAutoPlayDuration: number | undefined =
    config.featuredShort?.autoPlayDurationInMs;

  const router = useRouter();

  const activeSide: MoneyGuruSide =
    router.query.side === "tools" ? "tools" : DEFAULT_SIDE;

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
        },
      );

      router.push({
        pathname: "/shorts-old",
        hash: navigateToShortId.toString(),
      });
      return;
    }

    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.FIN_LITERACY_DASHBOARD_SCREEN,
    );
    logMoneyGuruEvent(AnalyticEvent.MONEY_GURU_VIEWED);
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
    getValueFromMetadata("appPlatformName"),
  );

  const idToken = getValueFromMetadata("idToken");
  const userId = getValueFromMetadata("id");
  const employerId = getValueFromMetadata("employerId");
  const workerId = getValueFromMetadata("workerId");

  function handleSideChange(side: MoneyGuruSide) {
    logMoneyGuruEvent(AnalyticEvent.SIDE_SWITCHED, { side });
    router.push(
      { pathname: router.pathname, query: { ...router.query, side } },
      undefined,
      { shallow: true, scroll: false },
    );
  }

  function handleFinToolClick(name: string, url: string) {
    setLoadingWithTimeoutToReset(true);
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.FIN_LITERACY_TOOLS_CLICKED,
      {
        tool_name: name,
      },
    );

    const _url = url
      .replace("{userId}", userId ?? "")
      .replace("{idToken}", idToken ?? "");
    router.push(_url);
  }

  function handleToolsSideClick(name: string, url: string) {
    handleFinToolClick(name, url);
    if (name === "credit_score") {
      logMoneyGuruEvent(AnalyticEvent.CREDIT_SCORE_VIEWED);
    }
    if (name === "coaching") {
      logMoneyGuruEvent(AnalyticEvent.COACHING_CLICKED);
    }
  }

  function handleBannerClick(name: string) {
    setLoadingWithTimeoutToReset(true);
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_BANNER_CLICKED, {
      name,
    });
  }

  function handleCarouselBannerClick(
    name: string,
    bannerType: "carousel" | "experiment",
  ) {
    return () => {
      logEventInMixpanel(AnalyticEvent.FIN_LITERACY_BANNER_CLICKED, {
        banner_type: bannerType,
        name,
      });
    };
  }

  function handleFeaturedShortClick(id: string, path: string = "/shorts") {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.R_SHORTS_OPENED,
      {
        short_id: id,
      },
    );
    logMoneyGuruEvent(AnalyticEvent.NEWS_OPENED, { entry_point: "learn" });
    router.push({
      pathname: path,
      hash: id,
    });
  }

  const finLiteracyTrackers = useMemo(
    () =>
      config.trackers.filter((tool: any) => {
        const releaseConfigs = tool.releaseConfigs;
        if (!Array.isArray(releaseConfigs)) return true;
        return releaseConfigs.some((releaseConfig) =>
          checkIfFeatureEnabledByReleaseConfig(releaseConfig, {
            employerId,
            workerId,
          }),
        );
      }),
    [config.trackers, employerId, workerId],
  );

  const stickyBanners = config.stickyBanners.filter((banner: any) =>
    checkIfFeatureEnabledByReleaseConfig(banner.releaseConfig, {
      employerId,
      workerId,
    }),
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
      },
    );
    return applicableBanners[0] ?? null;
  }, []);

  const componentsOrder = useMemo<DashboardComponent[]>(() => {
    const componentsOrderConfig = config.componentsOrderConfig.find(
      (order: any) => {
        return checkIfFeatureEnabledByReleaseConfig(order.releaseConfigs, {
          employerId,
          workerId,
        });
      },
    );
    if (!componentsOrderConfig) return DEFAULT_COMPONENTS_ORDER_FALLBACK;
    return (componentsOrderConfig.order as DashboardComponent[]).filter(
      (componentName) =>
        Object.values(DashboardComponent).includes(componentName),
    );
  }, [config.componentsOrderConfig]);

  const shouldShowOldShorts = checkIfFeatureEnabledByReleaseConfig(
    config.shouldShowOldShortsRelaseConfig,
    {
      employerId,
    },
  );

  if (!isMounted || isLoading || isLoadingShorts) return <DashboardLoader />;

  const COMPONENTS_NAME_TO_ELEMENT_MAP: Record<
    DashboardComponent,
    ReactElement | null
  > = {
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
  };

  const learnSideContent = (
    <>
      <h3 className="text-body text-semibold mb-4 pt-4">
        {t("mongu_dashboard_featured_short_title")}
      </h3>
      <Carousel
        autoPlay={!!featuredShortCarouselAutoPlayDuration}
        infiniteLoop
        interval={featuredShortCarouselAutoPlayDuration}
        showIndicators={(shouldShowOldShorts ? oldShorts : shorts).length > 1}
      >
        {(shouldShowOldShorts ? oldShorts : shorts).map((shortItem) => {
          return (
            <div key={shortItem.id} className="mb-8">
              <FeaturedShort
                mediaType={(shortItem.metadata?.mediaType ?? "") as string}
                mediaUrl={(shortItem.metadata?.mediaUrl ?? "") as string}
                thumbnailUrl={
                  (shortItem.metadata?.thumbnailUrl as string) ?? null
                }
                onClick={() =>
                  handleFeaturedShortClick(shortItem.id, shortItem.routePath)
                }
                content={shortItem.content}
              />
            </div>
          );
        })}
      </Carousel>
      <LearningModulePreview
        modules={learningModules}
        isLoading={isLoadingLearningModules}
        hasError={!isLoadingLearningModules && !learningModulesData}
      />
    </>
  );

  const toolsSideContent = (
    <>
      <h3 className="text-body text-semibold">
        {t("mongu_dashboard_trackers_title")}
      </h3>
      <TrackerTileWrapper
        onClick={handleToolsSideClick}
        trackers={finLiteracyTrackers}
      />
      <h3 className="text-body text-semibold mt-6">
        {t("mongu_dashboard_calculators_title")}
      </h3>
      <CalculatorTiles
        calculators={config.calculators}
        onCalculatorClick={handleToolsSideClick}
      />
    </>
  );

  return (
    <PageLayout
      navbarText="Money Guru"
      transparentNavbar
      hasContentPadding
      dispatchPopEventOnBackClick={isWebviewInsideRefyneApp}
      pageBackground="#F7F7F7"
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

      <div className="dashboard-contents-container pt-4">
        <SegmentedControl
          value={activeSide}
          onChange={handleSideChange}
          options={[
            { value: "learn", label: t("money_guru_side_learn_label") },
            { value: "tools", label: t("money_guru_side_tools_label") },
          ]}
        />
      </div>

      <div className="dashboard-contents-container pt-4">
        {activeSide === "learn" ? learnSideContent : toolsSideContent}
      </div>
    </PageLayout>
  );
}

type HomePageProps = {
  shorts: {
    id: string;
    metadata: Record<string, unknown>;
    content: string;
    reaction: {
      liked: number;
    };
    routePath?: string;
  }[];
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context,
) => {
  const { locale = "en" } = context;
  const shorts = (await getShortsByLocale(locale))
    ?.slice(0, 5)
    ?.map((short) => {
      return {
        ...short,
        routePath: "/shorts-old",
      };
    });

  return {
    props: {
      shorts,
    },
  };
};
