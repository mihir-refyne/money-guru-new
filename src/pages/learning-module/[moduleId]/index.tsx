import { ModuleChapters } from "@/components/LearningModule/ModuleChapters/LearningModuleChapters";
import {
  fetchLearningModules,
  LearningModuleTypeResponseProps,
} from "@/lib/utils/learningModulesFetcher";

export default function LearningModuleChapters({
  initialData,
}: {
  initialData: LearningModuleTypeResponseProps;
}) {
  return <ModuleChapters learningModulesDataResponse={initialData} />;
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
