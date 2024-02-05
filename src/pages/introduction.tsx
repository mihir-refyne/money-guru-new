import { useEffect } from "react";
import { setWatchedIntroduction } from "@/lib/core";
import { useRouter } from "next/router";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import config from "../../data/introduction_page.json";
import Introduction from "@/components/Introduction";

export default function IntroductionPage() {
  const router = useRouter();

  useEffect(() => {
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_LAUNCH_SCREEN);
  }, []);

  function handleContinue() {
    setWatchedIntroduction();
    router.replace({
      pathname: "/",
      query: router.query,
    });
  }

  function handleNextClick() {
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_LAUNCH_SCREEN_COMPLETED);
    handleContinue();
  }

  function handleSkipClick() {
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_LAUNCH_SCREEN_SKIP_CLICKED);
    handleContinue();
  }

  return (
    <Introduction
      stories={config.stories}
      onComplete={handleNextClick}
      onSkipClick={handleSkipClick}
      finalStoryFooterCtaConfig={{
        text: "Get started",
        onClick: handleNextClick,
      }}
      loop={false}
    />
  );
}

export function getStaticProps() {
  return {
    props: {},
  };
}
