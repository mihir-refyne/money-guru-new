import useTranslation from "@/hooks/useTranslation";
import styles from "./styles.module.css";
import Accordions from "@/components/Accordion";
import Image from "next/image";
import CaretRight from "../../../../public/assets/images/two-wheeler-loan/caret_right_blue.svg";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { useRouter } from "next/router";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { getRouteHandler } from "@/components/CreditScoreBuilder/helpers";
import { APP_BASE_URL } from "@/constants";
import TwoWheelerLoanConfigData from "../../../../data/two_wheeler_config.json";

export const FAQSection = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const idToken = getValueFromMetadata("idToken");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const isRefyneWebview = isCurrentlyOnRefyneWebview(appPlatformName);
  const FAQ_URL = `${APP_BASE_URL}/#/?next=faq/questions/${encodeURIComponent(
    TwoWheelerLoanConfigData.twoWheelerLoanFaqId
  )}`;

  const routeToFaqClick = getRouteHandler({
    navigateTo: FAQ_URL,
    isRefyneWebview,
    router,
    idToken,
    nativeDispatchType: "ROUTE_TO_SCREEN_ONLY",
  });

  const COMMON_ACCORDION_ITEM_STYLE = {
    headerFontWeight: "400",
    borderBottomStyle: styles.faq_accordion_item_bottom_border,
    accordionItemStyle: styles.faq_accordion_outer_item,
  };

  const ACCORDION_FAQS_ITEMS = [
    {
      ...COMMON_ACCORDION_ITEM_STYLE,

      id: "faq1",
      headerText: t("two_wheeler_faq_question_1"),
      content: (
        <div
          style={{ color: "#888888", fontSize: "14px", lineHeight: "20px" }}
          className="text-regular"
        >
          {t("two_wheeler_faq_answer_1")}
        </div>
      ),
    },
    {
      ...COMMON_ACCORDION_ITEM_STYLE,

      id: "faq2",
      headerText: t("two_wheeler_faq_question_2"),
      content: (
        <div style={{ color: "#888888", fontSize: "14px", lineHeight: "20px" }}>
          {t("two_wheeler_faq_answer_2")}
        </div>
      ),
    },
    {
      ...COMMON_ACCORDION_ITEM_STYLE,

      id: "faq3",
      headerText: t("two_wheeler_faq_question_3"),
      content: (
        <div style={{ color: "#888888", fontSize: "14px", lineHeight: "20px" }}>
          {t("two_wheeler_faq_answer_3")}
        </div>
      ),
    },
    {
      ...COMMON_ACCORDION_ITEM_STYLE,

      id: "faq4",
      headerText: t("two_wheeler_faq_question_4"),
      content: (
        <div style={{ color: "#888888", fontSize: "14px", lineHeight: "20px" }}>
          {t("two_wheeler_faq_answer_4")}
        </div>
      ),
    },
    {
      ...COMMON_ACCORDION_ITEM_STYLE,

      id: "faq5",
      headerText: t("two_wheeler_faq_question_5"),
      content: (
        <div style={{ color: "#888888", fontSize: "14px", lineHeight: "20px" }}>
          {t("two_wheeler_faq_answer_5")}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        paddingTop: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        padding: "6px",
        gap: "12px",
      }}
    >
      <p
        className="text-semibold"
        style={{
          paddingLeft: "12px",
          fontSize: "14px",
          lineHeight: "20px",
          textAlign: "center",
          color: "#121212",
        }}
      >
        {t("two_wheeler_faq_heading")}
      </p>{" "}
      <div
        onClick={() => {
          logAnalyticsEvent(
            ["mixpanel", "webengage"],
            AnalyticEvent.BIKE_LOAN_FAQS_CLICKED,
            {
              source: "Landing Page",
            }
          );
        }}
      >
        <Accordions
          items={ACCORDION_FAQS_ITEMS}
          style={styles.faq_accordion_item}
          hideBottomBorder={true}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={() => routeToFaqClick()}>
          <p
            className="text-semibold"
            style={{
              paddingLeft: "12px",
              fontSize: "14px",
              lineHeight: "20px",
              textAlign: "center",
              color: "var(--clr-brand-default)",
            }}
          >
            {t("two_wheeler_landing_page_view_all_faqs")}
          </p>{" "}
        </button>
        <Image src={CaretRight} alt="Caret Right" />
      </div>
    </div>
  );
};
