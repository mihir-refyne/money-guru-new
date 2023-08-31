import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import CenterContent from "@/components/CenterContent";
import PageLayout from "@/components/PageLayout";
import { useSurveyTrigger } from "@/hooks/useSurveyTrigger";
import quizStartIllustrationUrl from "@/images/money-guru-quiz-start-illustration.png";
import { SurveyTriggerAction } from "@/lib/survey";
import Redirect from "@/components/Redirect";
import useTranslation from "@/hooks/useTranslation";
import { isQuizCompleted, setQuizResponse } from "@/lib/quiz";

function getSurveyTriggerFromUrlQueryValue(
  value?: string
): SurveyTriggerAction | null {
  if (!value) return null;
  const possibleActions: string[] = Object.values(SurveyTriggerAction);
  if (possibleActions.includes(value)) return value as SurveyTriggerAction;
  return null;
}

export default function QuizStartPageWrapper() {
  const router = useRouter();
  const triggerFromUrl = router.query.trigger?.toString();
  const surveyTriggerAction = getSurveyTriggerFromUrlQueryValue(triggerFromUrl);
  const quizIdFromUrl = router.query.id?.toString();

  const quizAlreadyCompleted = useMemo(() => {
    if (!quizIdFromUrl) return false;
    return isQuizCompleted(quizIdFromUrl);
  }, [quizIdFromUrl]);

  if (!surveyTriggerAction || !quizIdFromUrl) return <Redirect to="/" />;

  if (quizAlreadyCompleted) return <QuizAlreadyCompletedPage />;

  return (
    <QuizStartPage
      surveyTriggerAction={surveyTriggerAction}
      quizId={quizIdFromUrl}
    />
  );
}

function QuizAlreadyCompletedPage() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const returnToFromUrl = router.query.returnTo?.toString();

  function handleBack() {
    if (returnToFromUrl) {
      return router.replace(decodeURIComponent(returnToFromUrl));
    }
    router.back();
  }

  return (
    <PageLayout
      navbarText={t("money_guru_quiz_title")}
      alignContentCenter
      footer={
        <div className="p-4">
          <button
            className="btn btn-primary-light btn-block"
            onClick={handleBack}
          >
            {t("go_back")}
          </button>
        </div>
      }
    >
      <CenterContent
        illustration={
          <Image
            src={quizStartIllustrationUrl}
            alt="Money Guru Quiz Start"
            style={{
              maxWidth: "18rem",
              maxHeight: "20rem",
              objectFit: "contain",
            }}
          />
        }
        title={t("money_guru_quiz_completed_title")}
        description={t("money_guru_quiz_completed_description")}
      />
    </PageLayout>
  );
}

function QuizStartPage(props: {
  quizId: string;
  surveyTriggerAction: SurveyTriggerAction;
}) {
  const { quizId, surveyTriggerAction } = props;
  const { t } = useTranslation("common");
  const router = useRouter();
  const { isFetching, isSurveyWindowLoading, prefetch, dispatchAction } =
    useSurveyTrigger({
      onComplete: handleCompleted,
      onNotFound: handleSkipClick,
    });

  const returnToFromUrl = router.query.returnTo?.toString();

  useEffect(() => {
    prefetch(surveyTriggerAction);
  }, [surveyTriggerAction]);

  function handleStartClick() {
    if (surveyTriggerAction) {
      dispatchAction(surveyTriggerAction);
    }
  }

  function handleBack() {
    if (returnToFromUrl) {
      return router.replace(decodeURIComponent(returnToFromUrl));
    }
    router.back();
  }
  function handleCompleted() {
    setQuizResponse({
      quizId,
      action: "COMPLETED",
      onDate: new Date(),
    });
    handleBack();
  }
  function handleSkipClick() {
    setQuizResponse({
      quizId,
      action: "SKIPPED",
      onDate: new Date(),
    });
    handleBack();
  }

  const isLoading = isFetching || isSurveyWindowLoading;

  return (
    <PageLayout
      navbarText={t("money_guru_quiz_title")}
      alignContentCenter
      footer={
        <div className="p-4">
          <button
            className="btn btn-primary btn-block"
            onClick={handleStartClick}
            disabled={isLoading}
          >
            {t("start_quiz")}
          </button>
          <button
            className="btn btn-primary-light btn-block mt-4"
            onClick={handleSkipClick}
            disabled={isLoading}
          >
            {t("skip")}
          </button>
        </div>
      }
    >
      <CenterContent
        illustration={
          <Image
            src={quizStartIllustrationUrl}
            alt="Money Guru Quiz Start"
            style={{
              maxWidth: "18rem",
              maxHeight: "20rem",
              objectFit: "contain",
            }}
          />
        }
        title={t("money_guru_quiz_title")}
        description={t("money_guru_quiz_description")}
      />
    </PageLayout>
  );
}
