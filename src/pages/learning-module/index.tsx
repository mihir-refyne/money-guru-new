import LearningModule from "@/components/LearningModule";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import {
  fetchLearningModules,
  LearningModuleType,
} from "@/lib/utils/learningModulesFetcher";
import { useEffect } from "react";

export default function LearningModulePage({
  initialData,
}: {
  initialData: LearningModuleType[];
}) {
  useEffect(() => {}, [
    logEventInMixpanel(AnalyticEvent.MONEY_GURU_LEARNING_VIEWED),
  ]);

  return <LearningModule learningModulesData={initialData} />;
}

export async function getServerSideProps() {
  const result = await fetchLearningModules();

  if ("error" in result) {
    return { props: { initialData: null } };
  }

  return {
    props: {
      initialData: result.data,
    },
  };
}
