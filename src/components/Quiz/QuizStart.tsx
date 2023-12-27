import { useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";
import { SurveyTriggerAction } from "@/lib/survey";
import CenterContent from "../CenterContent";
import quizStartIllustrationUrl from "@/images/money-guru-quiz-start-illustration.png";
import QuizLayout from "./QuizLayout";

const DEFAULT_ILLUSTRATION_URL = quizStartIllustrationUrl.src;
const DEFAULT_TITLE = "money_guru_quiz_title";
const DEFAULT_DESCRIPTION = "money_guru_quiz_description";
const DEFAULT_START_CTA_LABEL = "start_quiz";
const DEFAULT_SKIP_CTA_LABEL = "skip";

interface QuizStartProps {
  loading?: boolean;
  surveyTriggerAction: SurveyTriggerAction;
  illustrationUrl?: string;
  title?: string;
  description?: string;
  startCtaLabel?: string;
  canSkip?: boolean;
  skipCtaLabel?: string;
  onMount?: (surveyTriggerAction: SurveyTriggerAction) => void;
  onStartClick?: () => void;
  onSkipClicked?: () => void;
}

export default function QuizStart({
  loading,
  surveyTriggerAction,
  illustrationUrl = DEFAULT_ILLUSTRATION_URL,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  startCtaLabel = DEFAULT_START_CTA_LABEL,
  canSkip = true,
  skipCtaLabel = DEFAULT_SKIP_CTA_LABEL,
  onMount,
  onStartClick,
  onSkipClicked,
}: QuizStartProps) {
  const { tWithoutTypeSafety } = useTranslation("common");

  useEffect(() => {
    onMount?.(surveyTriggerAction);
  }, [surveyTriggerAction]);

  return (
    <QuizLayout
      footer={
        <>
          <button
            id="QUIZ_START_CTA"
            className="btn btn-primary btn-block"
            onClick={onStartClick}
            disabled={loading}
          >
            {tWithoutTypeSafety(startCtaLabel)}
          </button>
          {canSkip && (
            <button
              className="btn btn-primary-light btn-block mt-4"
              onClick={onSkipClicked}
              disabled={loading}
            >
              {tWithoutTypeSafety(skipCtaLabel)}
            </button>
          )}
        </>
      }
    >
      <CenterContent
        illustration={
          <img
            src={illustrationUrl}
            alt="Money Guru Quiz Start"
            style={{
              maxWidth: "18rem",
              maxHeight: "20rem",
              objectFit: "contain",
            }}
          />
        }
        title={tWithoutTypeSafety(title)}
        description={tWithoutTypeSafety(description)}
      />
    </QuizLayout>
  );
}
