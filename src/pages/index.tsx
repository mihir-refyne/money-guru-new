import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import LoadingPage from "@/components/LoadingPage";
import { hasWatchedIntroduction } from "@/lib/core";
import PageLayout from "@/components/PageLayout";
import rightArrowIconUrl from "@/images/right-arrow.svg";
import heroBlobImageUrl from "@/images/hero-blob.png";
import Image from "next/image";
import config from "../../data/landing_page.json";
import { getShortsByLocale } from "@/lib/shorts/server";
import { GetStaticProps } from "next";
import { marked } from "marked";
import FeaturedShort from "@/components/Shorts/FeaturedShort";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import {
  checkIfFeatureEnabledByReleaseConfig,
  ReleaseConfig,
} from "@/lib/core/release-config";
import { getRandomNumbersInRange } from "@/lib/utils";
import Carousel from "@/components/Carousel";
import Banner, { BannerProps } from "@/components/Banner";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { logAnalyticsEvent } from "@/lib/analytics";
import { useSurveyTrigger } from "@/hooks/useSurveyTrigger";
import { SurveyTriggerAction } from "@/lib/survey";

interface HomePageProps {
  shorts: Array<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
  }>;
}

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context
) => {
  const { locale = "en" } = context;
  const shorts = await getShortsByLocale(locale);

  return {
    props: {
      shorts,
    },
  };
};

export default function HomePage({ shorts }: HomePageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatchAction } = useSurveyTrigger();

  const shortsToBeFeatured = useMemo<
    Array<{
      id: string;
      metadata: Record<string, unknown>;
      content: string;
    }>
  >(() => {
    const maxRange = shorts.length - 1 - 5;
    const numberOfShorts =
      config?.featuredShort?.numberOfShortsToBeFeatured ?? 1;
    const shortsToBeFeaturedFromConfig =
      config?.featuredShort?.shortsToBeFeatured ?? [];

    const shortsToBeFeaturedFromConfigIndexes: number[] =
      shortsToBeFeaturedFromConfig
        .map((shortId) => {
          return shorts.findIndex((val) => val.id === shortId);
        })
        .filter((val) => val >= 0);

    const numberOfShortsRequiredToBeRandom = Math.max(
      numberOfShorts - shortsToBeFeaturedFromConfigIndexes.length,
      0
    );

    const randomIndexes = getRandomNumbersInRange(
      0,
      maxRange,
      numberOfShortsRequiredToBeRandom,
      shortsToBeFeaturedFromConfigIndexes
    );
    const shortIndexes =
      shortsToBeFeaturedFromConfigIndexes.concat(randomIndexes);
    const shortsToBeFeatured = shortIndexes.map(
      (shortIndex) => shorts[shortIndex]
    );
    return shortsToBeFeatured;
  }, [shorts]);

  const featuredShortCarouselAutoPlayDuration: number | undefined =
    config.featuredShort?.autoPlayDurationInMs;

  const router = useRouter();

  const _carouselBanners: Array<
    BannerProps & { releaseConfig?: ReleaseConfig }
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

  const banners = config.finLiteracyBanners.filter((banner: any) =>
    checkIfFeatureEnabledByReleaseConfig(banner.releaseConfig, {
      employerId,
      workerId,
    })
  );
  const hasBanners = banners.length > 0;

  const carouselBanners = _carouselBanners?.filter((banner) => {
    if (!banner.releaseConfig) return true;
    return checkIfFeatureEnabledByReleaseConfig(banner.releaseConfig, {
      employerId,
      workerId,
    });
  });
  const hasCarouselBanners = carouselBanners.length > 0;

  if (!isMounted || isLoading) return <LoadingPage />;

  return (
    <PageLayout
      navbarText="Money Guru"
      transparentNavbar
      hasContentPadding={false}
      dispatchPopEventOnBackClick={isWebviewInsideRefyneApp}
    >
      <div
        className="hero"
        style={{
          backgroundImage: `url(${heroBlobImageUrl.src}), radial-gradient(51.9% 48.2% at 7.22% 14.84%, #FFFFFF 0%, #EBF5FF 100%)`,
          backgroundPositionX: "right",
          backgroundRepeat: "no-repeat",
          minHeight: "10rem",
        }}
      ></div>
      <div
        className="container pb-0"
        style={{
          marginTop: "-16rem",
        }}
      >
        <Carousel
          autoPlay={!!featuredShortCarouselAutoPlayDuration}
          infiniteLoop
          interval={featuredShortCarouselAutoPlayDuration}
          showIndicators={shortsToBeFeatured.length > 1}
        >
          {shortsToBeFeatured.map((shortItem) => {
            return (
              <div key={shortItem.id} className="mb-8">
                <FeaturedShort
                  mediaType={(shortItem.metadata?.mediaType ?? "") as string}
                  mediaUrl={(shortItem.metadata?.mediaUrl ?? "") as string}
                  tag={(shortItem.metadata?.tag ?? "") as string}
                  onClick={() => handleFeaturedShortClick(shortItem.id)}
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
      </div>

      {hasBanners && (
        <div className="container">
          {banners.map((banner: any, index) => (
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
                dangerouslySetInnerHTML={{ __html: banner.label }}
                style={{
                  flexGrow: 1,
                  marginRight: "var(--spacing-2)",
                }}
              />
              <Image src={rightArrowIconUrl} alt="right arrow icon" />
            </a>
          ))}
        </div>
      )}
      <div className="container">
        <h3 className="clr-text-secondary mb-3">Tools</h3>
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
                dangerouslySetInnerHTML={{ __html: tool.title }}
              />
            </div>
          ))}
        </div>
      </div>
      {hasCarouselBanners && (
        <div
          className={`container ${carouselBanners.length > 1 ? "px-0" : ""}`}
        >
          <Carousel
            autoPlay={!!carouselBannerAutoPlayDurationInMs}
            infiniteLoop
            centerMode
            centerSlidePercentage={90}
            interval={carouselBannerAutoPlayDurationInMs}
          >
            {carouselBanners.map((banner, index) => (
              <Banner key={index} {...banner} />
            ))}
          </Carousel>
        </div>
      )}
    </PageLayout>
  );
}
