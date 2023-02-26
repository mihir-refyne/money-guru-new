import { useEffect, useState } from "react";
import { hasPreferredLocale, setPreferredLocale } from "@/lib/locale";
import { useRouter } from "next/router";
import LoadingPage from "@/components/LoadingPage";
import { hasWatchedIntroduction } from "@/lib/core";
import PageLayout from "@/components/PageLayout";
import SwipePrompt from "@/components/SwipePrompt";
import twoPeopleIllustrationUrl from "@/images/two-people-illustration.svg";
import heroBlobImageUrl from "@/images/hero-blob.png";
import calculatorPercentIconUrl from "@/images/calculator-percent-icon.svg";
import contentThumbNailImageUrl from "@/images/how-to-manage-money.png";
import Image from "next/image";
import config from "../../data/landing_page.json";
import { getShortsByLocale } from "@/lib/shorts/server";
import { isShortViewed } from "@/lib/shorts";
import { GetStaticProps } from "next";
import { marked } from "marked";
import FeaturedShort from "@/components/Shorts/FeaturedShort";

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
  const [shortToBeFeatured, setShortToBeFeatured] = useState<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!hasPreferredLocale()) {
      router.replace("/select-locale");
      return;
    }
    if (!hasWatchedIntroduction()) {
      router.replace("/introduction");
      return;
    }

    const firstUnViewedShort = shorts.find((short) => !isShortViewed(short.id));
    const shortToBeFeatured = firstUnViewedShort ?? shorts[0];
    setShortToBeFeatured(shortToBeFeatured);

    // NEXTjs hack!
    setIsMounted(true);
  }, []);

  if (!isMounted) return <LoadingPage />;

  return (
    <PageLayout
      navbarText="Financial Literacy"
      transparentNavbar
      hasContentPadding={false}
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
            <Image src={twoPeopleIllustrationUrl} alt="Hey Abhijeeth" />
          </figure>
          <h2 className="text-sub-title text-medium mb-2">Hey Abhijeeth,</h2>
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
              onClick={() => {
                router.push(`/shorts#${shortToBeFeatured.id}`);
              }}
            >
              <article
                dangerouslySetInnerHTML={{
                  __html: marked(shortToBeFeatured.content),
                }}
              />
            </FeaturedShort>
          )}
        </div>
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
            {config.finLiteracyTools.map((tool) => (
              <div
                style={{
                  backgroundColor: tool.backgroundColor,
                  borderRadius: "0.8rem",
                  padding: "0.8rem",
                }}
              >
                <figure>
                  <Image src={tool.iconUrl} alt={tool.title} />
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
