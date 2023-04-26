import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingPage from "@/components/LoadingPage";
import { hasWatchedIntroduction } from "@/lib/core";
import PageLayout from "@/components/PageLayout";
import SwipePrompt from "@/components/SwipePrompt";
import twoPeopleIllustrationUrl from "@/images/two-people-illustration.svg";
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
import { checkIfFeatureEnabledByReleaseConfig } from "@/lib/core/release-config";
import { getRandomNumberInRange } from "@/lib/utils";

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
  // render LandingPage
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shortToBeFeatured, setShortToBeFeatured] = useState<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!hasWatchedIntroduction()) {
      router.replace("/introduction");
      return;
    }
    const navigateToShortId = router.query["short-id"];
    if (navigateToShortId) {
      // Cleanup short-id for back click
      router.replace({
        pathname: router.pathname,
      }, undefined, {
        shallow: true
      });

      router.push({
        pathname: "/shorts",
        hash: navigateToShortId.toString(),
      })
      return;
    }

    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_DASHBOARD_SCREEN);

    // NEXTjs hack!
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const randomIndex = getRandomNumberInRange(0, shorts.length - 1 - 5);
    const shortToBeFeatured = shorts[randomIndex] ?? shorts[0];
    setShortToBeFeatured(shortToBeFeatured);
  }, [shorts]);

  function setLoadingWithTimeoutToReset(state: boolean) {
    setIsLoading(state);
    // INFO: Have to add this due to Next.js browser back not resetting state issue
    setTimeout(() => setIsLoading(!state), 5000);
  }

  const idToken = getValueFromMetadata("idToken");
  const userId = getValueFromMetadata("id");
  const userName = getValueFromMetadata("name");
  const employerId = getValueFromMetadata("employerId");
  const userFirstName = userName && userName.split(" ")[0];
  const salutation = ["Hey", userFirstName?.toLowerCase()]
    .filter(Boolean)
    .join(" ");

  function handleFinToolClick(name: string, url: string) {
    setLoadingWithTimeoutToReset(true);
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_TOOLS_CLICKED, {
      tool_name: name,
    });

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
    logEventInMixpanel(AnalyticEvent.R_SHORTS_OPENED, {
      short_id: id,
    });
    router.push(`/shorts#${id}`);
  }

  const banners = config.finLiteracyBanners.filter((banner) =>
    checkIfFeatureEnabledByReleaseConfig(banner.releaseConfig, {
      employerId,
    })
  );
  const hasBanners = banners.length > 0;

  if (!isMounted || isLoading) return <LoadingPage />;

  return (
    <PageLayout
      navbarText="Financial Literacy"
      transparentNavbar
      hasContentPadding={false}
      dispatchPopEventOnBackClick
    >
      <SwipePrompt
        position="bottom"
        prompt="Swipe up to start reading R-Shorts"
      >
        <div
          className="hero"
          style={{
            backgroundImage: `url(${heroBlobImageUrl.src}), radial-gradient(51.9% 48.2% at 7.22% 14.84%, #FFFFFF 0%, #EBF5FF 100%)`,
            backgroundPositionX: "right",
            backgroundRepeat: "no-repeat",
          }}
        >
          <figure className="mb-3">
            <Image src={twoPeopleIllustrationUrl} alt="Hey" />
          </figure>
          <h2
            className="text-sub-title text-medium mb-2"
            style={{
              textTransform: "capitalize",
            }}
          >
            {salutation},
          </h2>
          <p className="clr-text-secondary">
            Understanding finances has never been easier. Start reading!
          </p>
        </div>
        <div
          className="container"
          style={{
            marginTop: "-6.4rem",
          }}
        >
          {shortToBeFeatured && (
            <FeaturedShort
              imageUrl={(shortToBeFeatured.metadata?.mediaUrl ?? "") as string}
              tag={(shortToBeFeatured.metadata?.tag ?? "") as string}
              onClick={() => handleFeaturedShortClick(shortToBeFeatured.id)}
            >
              <article
                dangerouslySetInnerHTML={{
                  __html: marked(shortToBeFeatured.content),
                }}
              />
            </FeaturedShort>
          )}
        </div>
        {hasBanners && (
          <div className="container">
            {banners.map((banner, index) => (
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
          <h3 className="clr-text-secondary mb-3">Fin Literacy Tools</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              columnGap: "1.6rem",
              rowGap: "1.6rem",
            }}
          >
            {config.finLiteracyTools.map((tool, index) => (
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
      </SwipePrompt>
    </PageLayout>
  );
}
