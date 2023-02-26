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

export default function HomePage() {
  // render LandingPage
  const [isMounted, setIsMounted] = useState(false);

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
          <div
            style={{
              background: "#fff",
              border: "2px solid #E5EEF8",
              borderRadius: "1.6rem",
              minHeight: "24rem",
              padding: "1.6rem",
            }}
          >
            <figure>
              <Image
                src={contentThumbNailImageUrl}
                alt="content"
                style={{ width: "100%" }}
              />
            </figure>
            <h3 className="text-body text-medium my-2">
              How to Manage Your Money?
            </h3>
            <p className="text-caption clr-text-secondary">
              Most people talk about earning more money, however, not many
              people talk...{" "}
              <span className="clr-brand-default text-semibold">Read More</span>
            </p>
          </div>
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
            <div
              style={{
                background: "#FCF2E3",
                borderRadius: "0.8rem",
                padding: "0.8rem",
              }}
            >
              <figure>
                <Image src={calculatorPercentIconUrl} alt="icon" />
              </figure>
              <p className="text-caption mt-4">
                <b>Loan EMI</b>
                <br /> Calculator
              </p>
            </div>
            <div
              style={{
                background: "#FCF2E3",
                borderRadius: "0.8rem",
                padding: "0.8rem",
              }}
            >
              <figure>
                <Image src={calculatorPercentIconUrl} alt="icon" />
              </figure>
              <p className="text-caption mt-4">
                <b>Loan EMI</b>
                <br /> Calculator
              </p>
            </div>
            <div
              style={{
                background: "#FCF2E3",
                borderRadius: "0.8rem",
                padding: "0.8rem",
              }}
            >
              <figure>
                <Image src={calculatorPercentIconUrl} alt="icon" />
              </figure>
              <p className="text-caption mt-4">
                <b>Loan EMI</b>
                <br /> Calculator
              </p>
            </div>
          </div>
        </div>
      </SwipePrompt>
    </PageLayout>
  );
}

export function getStaticProps() {
  return {
    props: {},
  };
}
