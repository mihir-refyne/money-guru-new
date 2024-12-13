import { ModuleChapters } from "@/components/LearningModule/ModuleChapters/LearningModuleChapters";
import {
  fetchLearningModules,
  LearningModuleType,
} from "@/lib/utils/learningModulesFetcher";

export default function LearningModuleChapters({
  initialData,
}: {
  initialData: LearningModuleType[];
}) {
  return <ModuleChapters learningModulesData={initialData} />;
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
