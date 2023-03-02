import SwipeButton from "@/components/SwipeButton";
import PageLayout from "@/components/PageLayout";
import { useEffect, useRef } from "react";
import { setWatchedIntroduction } from "@/lib/core";
import { useRouter } from "next/router";
import { isTouchDevice } from "@/lib/utils";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import config from "../../data/introduction_page.json";

const TRANSITION_TIMEOUT = 1.5 * 1000;

export default function IntroPage() {
  const router = useRouter();
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setWatchedIntroduction();
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_LAUNCH_SCREEN);

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
          <div className="p-4 border-bottom-dashed">
            <p className="clr-text-secondary">
              {config.peopleBenefitted}+ people have benefitted from Financial
              Advice from Refyne
            </p>
          </div>
          <div className="container">
            <SwipeButton
              onSuccessSwipe={handleSwipeComplete}
              clickToUnlock={!_isTouchDevice}
            >
              {_isTouchDevice ? "Swipe To Unlock" : "Click To Unlock"}
            </SwipeButton>
          </div>
        </>
      }
    >
      <h1
        className="text-sub-title text-semibold"
        style={{
          lineHeight: "4.2rem",
        }}
      >
        Increase your financial knowledge with Refyne!
      </h1>
      <figure className="my-6 text-center">
        <img src={config.illustrationUrl} alt="Intro illustration" />
      </figure>
    </PageLayout>
  );
}

export function getStaticProps() {
  return {
    props: {},
  };
}
