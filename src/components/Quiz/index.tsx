import { useMemo } from "react";
import { SurveyTriggerAction } from "@/lib/survey";
import { isQuizCompleted, setQuizResponse } from "@/lib/quiz";
import QuizAlreadyCompleted from "./QuizAlreadyCompleted";
import QuizStart from "./QuizStart";
import { useSurveyTrigger } from "@/hooks/useSurveyTrigger";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";

interface QuizProps {
  quizId: string;
  surveyTriggerAction: SurveyTriggerAction;
  hasNavbar?: boolean;

  startPageIllustrationUrl?: string;
  startPageTitle?: string;
  startPageDescription?: string;
  startPageStartCtaLabel?: string;
  startPageCanSkip?: boolean;
  startPageSkipCtaLabel?: string;

  completedPageIllustrationUrl?: string;
  completedPageTitle?: string;
  completedPageDescription?: string;
  completedPageBackCtaLabel?: string;

  eventMetadata?: Record<string, string>;
  onBackClick?: () => void;
}

export default function Quiz({
  quizId,
  surveyTriggerAction,
  startPageIllustrationUrl,
  startPageTitle,
  startPageDescription,
  startPageCanSkip,
  startPageSkipCtaLabel,
  startPageStartCtaLabel,
  completedPageTitle,
  completedPageIllustrationUrl,
  completedPageBackCtaLabel,
  completedPageDescription,
  eventMetadata,
  onBackClick,
}: QuizProps) {
  const { isFetching, isSurveyWindowLoading, prefetch, dispatchAction } =
    useSurveyTrigger({
      onComplete: handleCompleted,
      onNotFound: handleSkipClick,
    });

  const quizAlreadyCompleted = useMemo(() => {
    return isQuizCompleted(quizId);
  }, [quizId]);

  function handleQuizStartMount() {
    prefetch(surveyTriggerAction);

    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.MONEY_GURU_QUIZ_INTRO_SCREEN,
      { quiz_id: quizId, ...eventMetadata }
    );
  }

  function handleStartQuizClick() {
    dispatchAction(surveyTriggerAction);

    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.MONEY_GURU_QUIZ_INTRO_SCREEN_CTA_CLICKED,
      { quiz_id: quizId, ...eventMetadata }
    );
  }

  function handleCompleted() {
    setQuizResponse({
      quizId,
      action: "COMPLETED",
      onDate: new Date(),
    });
    onBackClick?.();
  }
  function handleSkipClick() {
    setQuizResponse({
      quizId,
      action: "SKIPPED",
      onDate: new Date(),
    });
    onBackClick?.();
  }

  function handleSkipScreenCtaClick() {
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.MONEY_GURU_QUIZ_SUBMITTED_SCREEN_CTA_CLICKED,
      { quiz_id: quizId, ...eventMetadata }
    );
    onBackClick?.();
  }

  function handleQuizCompletedMount() {
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.MONEY_GURU_QUIZ_SUBMITTED_SCREEN,
      {
        quiz_id: quizId,
        ...eventMetadata,
      }
    );
  }

  if (quizAlreadyCompleted)
    return (
      <QuizAlreadyCompleted
        illustrationUrl={completedPageIllustrationUrl}
        title={completedPageTitle}
        description={completedPageDescription}
        backCtaLabel={completedPageBackCtaLabel}
        onMount={handleQuizCompletedMount}
        onBackClick={handleSkipScreenCtaClick}
      />
    );

  return (
    <QuizStart
      loading={isFetching ?? isSurveyWindowLoading}
      surveyTriggerAction={surveyTriggerAction}
      illustrationUrl={startPageIllustrationUrl}
      title={startPageTitle}
      description={startPageDescription}
      startCtaLabel={startPageStartCtaLabel}
      skipCtaLabel={startPageSkipCtaLabel}
      onMount={handleQuizStartMount}
      canSkip={startPageCanSkip}
      onSkipClicked={onBackClick}
      onStartClick={handleStartQuizClick}
    />
  );
}
