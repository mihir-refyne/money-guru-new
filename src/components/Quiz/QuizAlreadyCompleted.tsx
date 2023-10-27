import { useEffect } from "react";
import CenterContent from "../CenterContent";
import useTranslation from "@/hooks/useTranslation";
import quizStartIllustrationUrl from "@/images/money-guru-quiz-start-illustration.png";
import QuizLayout from "./QuizLayout";

const DEFAULT_ILLUSTRATION_URL = quizStartIllustrationUrl.src;
const DEFAULT_TITLE = "money_guru_quiz_completed_title";
const DEFAULT_DESCRIPTION = "money_guru_quiz_completed_description";
const DEFAULT_BACK_CTA_LABEL = "go_back";

interface QuizAlreadyCompletedProps {
  illustrationUrl?: string;
  title?: string;
  description?: string;
  backCtaLabel?: string;
  onMount?: () => void;
  onBackClick?: () => void;
}

export default function QuizAlreadyCompleted({
  illustrationUrl = DEFAULT_ILLUSTRATION_URL,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  backCtaLabel = DEFAULT_BACK_CTA_LABEL,
  onMount,
  onBackClick,
}: QuizAlreadyCompletedProps) {
  const { tWithoutTypeSafety } = useTranslation("common");

  useEffect(() => {
    onMount?.();
  }, []);

  return (
    <QuizLayout
      footer={
        <>
          <button
            className="btn btn-primary-light btn-block"
            onClick={onBackClick}
          >
            {tWithoutTypeSafety(backCtaLabel)}
          </button>
        </>
      }
    >
      <CenterContent
        illustration={
          <img
            src={illustrationUrl}
            alt="Money Guru Quiz Completed"
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
