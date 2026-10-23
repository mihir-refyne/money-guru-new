import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { LearningModuleType } from "@/lib/utils/learningModulesFetcher";
import Image from "next/image";
import { useRouter } from "next/router";
import LearningModuleData from "../../../data/learning_module.json";
import styles from "./LearningModule.module.css";

export default function LearningModuleGridItem({
  module,
  onBeforeNavigate,
}: {
  module: LearningModuleType;
  onBeforeNavigate?: (module: LearningModuleType) => void;
}) {
  const router = useRouter();

  function onClickModuleHandler({ id }: { id: number }) {
    logEventInMixpanel(AnalyticEvent.MONEY_GURU_LEARNING_MODULE_VIEWED, {
      moduleName: module.title,
    });
    onBeforeNavigate?.(module);
    router.push(`/learning-module/${id}`);
  }

  return (
    <div
      className={styles.gridItem}
      onClick={() => onClickModuleHandler({ id: module.id })}
    >
      <Image
        width={200}
        height={200}
        src={module.image ?? LearningModuleData.moduleSubPlaceHolder}
        alt="learning_module"
        layout="responsive"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <p className={styles.moduleTitle}>{module.title}</p>
      <p className={styles.chapterCount}>{module.chapters.length} Chapters</p>
    </div>
  );
}
