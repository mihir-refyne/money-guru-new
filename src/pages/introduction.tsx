import SwipeButton from "@/components/SwipeButton";
import Image from "next/image";
import introIllustrationUrl from "@/images/intro-illustration.svg";
import PageLayout from "@/components/PageLayout";
import { useEffect, useRef } from "react";
import { setWatchedIntroduction } from "@/lib/core";
import { useRouter } from "next/router";
import { isTouchDevice } from "@/lib/utils";

const TRANSITION_TIMEOUT = 1.5 * 1000;

export default function IntroPage() {
  const router = useRouter();
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setWatchedIntroduction();

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  function handleSwipeComplete() {
    transitionTimeoutRef.current = setTimeout(() => {
      router.replace("/");
    }, TRANSITION_TIMEOUT);
  }

  const _isTouchDevice = typeof window !== "undefined" && isTouchDevice();

  return (
    <PageLayout
      footer={
        <>
          <div className="p-4 border-bottom-dashed text-center">
            <p className="clr-text-secondary">
              12,000+ people have benefitted from Financial Advice from Refyne
            </p>
          </div>
          <div className="container">
            <SwipeButton
              onSuccessSwipe={handleSwipeComplete}
              clickToUnlock={!_isTouchDevice}
            >
              {_isTouchDevice ? "Swipe to unlock" : "Click to unlock"}
            </SwipeButton>
          </div>
        </>
      }
    >
      <h1
        className="text-sub-title text-center text-semibold"
        style={{
          lineHeight: "4.2rem",
        }}
      >
        Increase your financial knowledge with Refyne!
      </h1>
      <figure className="my-6 text-center">
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
