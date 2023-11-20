import { useEffect } from "react";
import { useRouter } from "next/router";
import ListCard from "../ListCard";
import unlockCreditScoreIllustration from "../../images/unlock_credit_score_illustration.svg";
import creditScoreMeterIllustration from "../../images/credit_score_meter_illustration.svg";
import creditScoreQuestionIllustration from "../../images/credit_score_question_illustration.svg";
import Image, { type StaticImageData } from "next/image";
import Tag, { type TagType } from "../Tag";
import useFetcher from "@/hooks/useFetcher";
import {
  CreditReportMetricRating,
  CreditReportResponse,
  fetchCreditReportMetadataAndReportIfActive,
} from "@/lib/credit-report";
import { isCreditReportIntroViewed } from "@/lib/credit-report/introduction";
import { format } from "date-fns";
import { getTagTypeByCreditMetricRating } from "./helpers";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import useTranslation, { type TypeSafeTranslate } from "@/hooks/useTranslation";

const MIN_CREDIT_SCORE_REQUIRED_TO_BE_SHOWN = 300;

function fetcherWrapperToHandleConsent<A extends unknown[], T>(
  hasGivenConsent: boolean,
  callbackFn: (...args: A) => T
): (...args: A) => T | null {
  return (...args: A) => {
    if (!hasGivenConsent) return null;
    return callbackFn(...args);
  };
}

interface CreditScoreWidgetProps {
  screen: string;
}

export default function CreditScoreWidget({ screen }: CreditScoreWidgetProps) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { isLoading, data } = useFetcher(
    fetcherWrapperToHandleConsent(
      isCreditReportIntroViewed(),
      fetchCreditReportMetadataAndReportIfActive
    )
  );

  function handleMixpanelAnalyticsEventTrigger(event: AnalyticEvent) {
    const score = getScoreIfAboveMinAcceptedFromReportResponse(
      data?.reportResponse
    );
    const properties = getAnalyticsEventsProperties({
      screen,
      canRefetch: data?.metadata.hasExpired === true,
      scoreAvailable: !!score?.value,
      creditRating: score?.rating,
    });
    logAnalyticsEvent(["mixpanel"], event, properties);
  }

  useEffect(() => {
    if (isLoading) return;
    handleMixpanelAnalyticsEventTrigger(
      AnalyticEvent.CREDIT_SCORE_WIDGET_SHOWN
    );
  }, [isLoading]);

  if (isLoading) return <EmptyElem />;

  const canRefetch = data?.metadata.hasExpired === true;
  const score = getScoreIfAboveMinAcceptedFromReportResponse(
    data?.reportResponse
  );
  const content = getContent(
    {
      canRefetch,
      score,
    },
    t
  );

  function handleOnClick() {
    handleMixpanelAnalyticsEventTrigger(
      AnalyticEvent.CREDIT_SCORE_WIDGET_CLICKED
    );
    router.push("/credit-report");
  }

  return (
    <ListCard
      background="linear-gradient(90deg, #EBF5FF 0%, #FFF 100%)"
      border="1px solid #EBF5FF"
      items={[
        {
          leftIcon: (
            <Image src={content.illustration} alt="Credit Score" width={48} />
          ),
          contentLeftTitle: content.title,
          contentLeftDescription: content.description,
          contentRightTitle: content.score?.toString(),
          contentRightTitleClassName: "text-sub-title text-semibold",
          contentRightDescription: content.rating ? (
            <Tag type={content.tagType} compact>
              {content.rating}
            </Tag>
          ) : undefined,
          alignItems: "center",
          hasGapBetweenContentItems: false,
          onClick: handleOnClick,
        },
      ]}
    />
  );
}

// This Hack is required to omit the extra space when not rendered
function EmptyElem() {
  return (
    <div
      style={{
        marginBottom: "calc(var(--spacing-6) * -1)",
      }}
    />
  );
}

interface CreditScoreWidgetContent {
  illustration: StaticImageData;
  title: string;
  description: string;
  score?: number;
  rating?: string;
  tagType?: TagType;
}

function getContent(
  context: {
    canRefetch: boolean;
    score?: {
      value: number;
      rating: CreditReportMetricRating;
    };
  },
  t: TypeSafeTranslate<"common">["t"]
): CreditScoreWidgetContent {
  const { canRefetch, score } = context;
  if (canRefetch) {
    const currentMonth = format(new Date(), "LLLL");
    return {
      illustration: creditScoreQuestionIllustration,
      title: t("your_month_score_here", { month: currentMonth }),
      description: t("click_here_get_latest_score"),
    };
  }
  if (score) {
    const creditScoreRating = score.rating.replaceAll("_", " ").toLowerCase();
    return {
      illustration: creditScoreMeterIllustration,
      title: t("credit_score_widget_title"),
      description: t("check_score_details_here"),
      score: score.value,
      rating: creditScoreRating,
      tagType: getTagTypeByCreditMetricRating(score.rating),
    };
  }
  return {
    illustration: unlockCreditScoreIllustration,
    title: t("unlock_credit_score"),
    description: t("click_here_get_latest_score"),
  };
}

function getScoreIfAboveMinAcceptedFromReportResponse(
  reportResponse?: CreditReportResponse | null
):
  | {
      value: number;
      rating: CreditReportMetricRating;
    }
  | undefined {
  if (!reportResponse) return;
  const scoreDetails = reportResponse.report.scoreDetails[0];
  if (!scoreDetails) return;
  const scoreValue = Number(scoreDetails.score);
  if (scoreValue < MIN_CREDIT_SCORE_REQUIRED_TO_BE_SHOWN) return;
  return {
    value: scoreValue,
    rating: scoreDetails.rating,
  };
}

interface AnalyticEventProperties {
  widget_type: "NOT_FETCHED" | "FETCHED" | "REFETCH_AVAILABLE";
  credit_rating?: string;
  screen: string;
}
function getAnalyticsEventsProperties(context: {
  screen: string;
  canRefetch: boolean;
  scoreAvailable: boolean;
  creditRating?: string;
}): AnalyticEventProperties {
  const { screen, canRefetch, scoreAvailable, creditRating } = context;
  const widgetType = canRefetch
    ? "REFETCH_AVAILABLE"
    : scoreAvailable
    ? "FETCHED"
    : "NOT_FETCHED";
  return {
    screen,
    widget_type: widgetType,
    credit_rating: creditRating,
  };
}
