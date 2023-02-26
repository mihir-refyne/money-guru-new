import SwipeButton from "@/components/SwipeButton";
import Image from "next/image";
import introIllustrationUrl from "@/images/intro-illustration.svg";
import PageLayout from "@/components/PageLayout";
import { useEffect } from "react";
import { setWatchedIntroduction } from "@/lib/core";
import { useRouter } from "next/router";

export default function IntroPage() {
  const router = useRouter();

  useEffect(() => {
    setWatchedIntroduction();
  }, []);

  function handleSwipeComplete() {
    router.replace("/");
  }

  return (
    <PageLayout
      footer={
        <>
          <div
            className="p-4"
            style={{
              borderBottom: "1px dashed #C9CDD1",
            }}
          >
            <p className="clr-text-secondary">
              12,000+ people have benefitted from Financial Advice from Refyne
            </p>
          </div>
          <div className="container">
            <SwipeButton onSuccessSwipe={handleSwipeComplete}>
              Swipe to unlock
            </SwipeButton>
          </div>
        </>
      }
    >
      <h1
        className="text-sub-title text-semibold"
        style={{
          lineHeight: "42px",
        }}
      >
        Increase your financial knowledge with Refyne!
      </h1>
      <figure className="my-6">
        <Image src={introIllustrationUrl} alt="Intro illustration" />
      </figure>
    </PageLayout>
  );
}

export function getStaticProps() {
  return {
    props: {},
  };
}
