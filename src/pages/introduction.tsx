import PageLayout from "@/components/PageLayout";
import { useEffect } from "react";
import { setWatchedIntroduction } from "@/lib/core";
import { useRouter } from "next/router";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import config from "../../data/introduction_page.json";

export default function IntroPage() {
  const router = useRouter();

  useEffect(() => {
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_LAUNCH_SCREEN);
  }, []);

  function handleNextClick() {
    setWatchedIntroduction();
    router.replace("/");
  }

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
            <button className="btn btn-primary btn-block" onClick={handleNextClick}>Next</button>
          </div>
        </>
      }
      dispatchPopEventOnBackClick
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
