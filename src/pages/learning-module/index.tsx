import LearningModule from "@/components/LearningModule";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import {
  fetchLearningModules,
  LearningModuleTypeResponseProps,
} from "@/lib/utils/learningModulesFetcher";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LearningModulePage({
  initialData,
}: {
  initialData: LearningModuleTypeResponseProps;
}) {
  const router = useRouter();
  const directlyAccessed = !!router.query["direct"];

  useEffect(() => {}, [
    logEventInMixpanel(AnalyticEvent.MONEY_GURU_LEARNING_VIEWED),
  ]);

  return (
    <LearningModule
      dispatchPopEventOnBackClick={directlyAccessed}
      learningModulesResponse={initialData}
    />
  );
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
