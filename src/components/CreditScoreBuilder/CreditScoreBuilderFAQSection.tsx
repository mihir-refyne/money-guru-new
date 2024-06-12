import { APP_BASE_URL } from "@/constants";
import useTranslation from "@/hooks/useTranslation";
import iconRight from "@/images/icon-right.svg";
import infoIcon from "@/images/info-line.svg";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import creditScoreBuilderConfig from "data/credit_score_builder.json";
import Image from "next/image";
import { useRouter } from "next/router";
import YoutubePlayer from "../YoutubePlayer";
import CreditScoreBuilderFAQCard from "./CreditScoreBuilderFAQCard";
import styles from "./CreditScoreBuilderFAQSection.module.css";
import { getRouteHandler } from "./helpers";

export default function CreditScoreBuilderFAQSection() {
  const { t } = useTranslation("common");

  const router = useRouter();

  const idToken = getValueFromMetadata("idToken");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);
  const routeToFaqClick = getRouteHandler({
    navigateTo: `${APP_BASE_URL}/#/?next=faq`,
    isRefyneWebview,
    router,
    idToken,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  function handleFaqClick() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.CREDIT_BUILDER_LANDING_PAGE_CTA_CLICKED,
      {
        source: "FAQ",
        cta: "FAQ",
      }
    );
    routeToFaqClick();
  }

  return (
    <div className={styles.Container}>
      <h2 className={`${styles.Heading} text-body`}>
        {t("credit_score_builder_video_title")}
      </h2>
      <div className={styles.Video}>
        <YoutubePlayer
          hideIfNotInView={false}
          url={creditScoreBuilderConfig.youtubeUrl}
        />
      </div>
      <div className={styles.CardContainer}>
        <CreditScoreBuilderFAQCard
          question={t("credit_score_builder_faq_one_ques")}
          answer={t("credit_score_builder_faq_one_ans")}
        />
        <CreditScoreBuilderFAQCard
          question={t("credit_score_builder_faq_two_ques")}
          answer={t("credit_score_builder_faq_two_ans")}
        />
        <CreditScoreBuilderFAQCard
          question={t("credit_score_builder_faq_three_ques")}
          answer={t("credit_score_builder_faq_three_ans")}
        />
      </div>
      <div onClick={handleFaqClick} role="link" className={styles.ExternalLink}>
        <p>View all FAQs</p>
        <Image src={iconRight} alt="FAQs" />
      </div>
      <div className={styles.Disclaimer}>
        <Image src={infoIcon} alt="info" />
        <p>{t("credit_score_builder_disclaimer")}</p>
      </div>
    </div>
  );
}
