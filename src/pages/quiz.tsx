import { useRouter } from "next/router";
import Redirect from "@/components/Redirect";
import Quiz from "@/components/Quiz";
import { getSurveyTriggerFromStringValue } from "@/components/Quiz/helpers";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";

export default function QuizStartPageWrapper() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const triggerFromUrl = router.query.trigger?.toString();
  const surveyTriggerAction = getSurveyTriggerFromStringValue(triggerFromUrl);
  const quizIdFromUrl = router.query.id?.toString();
  const returnToFromUrl = router.query.returnTo?.toString();

  if (!surveyTriggerAction || !quizIdFromUrl) return <Redirect to="/" />;

  function handleBack() {
    if (returnToFromUrl) {
      return router.replace(decodeURIComponent(returnToFromUrl));
    }
    router.back();
  }

  return (
    <PageLayout navbarText={t("money_guru_quiz_title")} alignContentCenter>
      <Quiz
        quizId={quizIdFromUrl}
        surveyTriggerAction={surveyTriggerAction}
        onBackClick={handleBack}
      />
    </PageLayout>
  );
}
