import { ChapterContainer } from "@/components/LearningModule/Chapter/ChapterContainer";
import {
  fetchLearningModules,
  LearningModuleTypeResponseProps,
} from "@/lib/utils/learningModulesFetcher";

export default function ChapterPage({
  initialData,
}: {
  initialData: LearningModuleTypeResponseProps;
}) {
  return <ChapterContainer learningModulesData={initialData} />;
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
