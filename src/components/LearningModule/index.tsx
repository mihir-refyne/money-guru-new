import LearningModuleData from "../../../data/learning_module.json";
import styles from "./LearningModule.module.css";

import { useRouter } from "next/router";
import { LearningModuleLayout } from "./LearningModuleLayout/LearningModuleLayout";

import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import {
  LearningModuleType,
  LearningModuleTypeResponseProps,
} from "@/lib/utils/learningModulesFetcher";
import VideoFillerBanner from "../VideoFillerBanner/VideoFillerBanner";

export default function LearningModule({
  learningModulesResponse,
  dispatchPopEventOnBackClick,
}: {
  learningModulesResponse?: LearningModuleTypeResponseProps;
  dispatchPopEventOnBackClick?: boolean;
}) {
  return (
    <LearningModuleLayout
      dispatchPopEventOnBackClick={dispatchPopEventOnBackClick}
    >
      <div className={styles.learningModule}>
        <div className={styles.imageContainer}>
          <VideoFillerBanner
            videoUrl={
              learningModulesResponse?.youtubeUrl ??
              "https://www.youtube.com/watch?v=rOCf--8EiIQ"
            }
            autoPlayable={false}
          />
        </div>
        <div className={styles.titleContainer}>
          <h3
            className={`${styles.heading} text-heading text-semi-bold text-left my-2`}
          >
            Learn about Finances
          </h3>
          <p className={`${styles.supportingTitle} text-regular`}>
            Explore modules
          </p>
        </div>
        <div className={styles.moduleGrid}>
          {learningModulesResponse?.modules?.map((module, index) => (
            <LearningModuleGridItem key={index} module={module} />
          ))}
        </div>
      </div>
    </LearningModuleLayout>
  );
}

const LearningModuleGridItem = ({ module }: { module: LearningModuleType }) => {
  const router = useRouter();

  function onClickModuleHandler({ id }: { id: number }) {
    logEventInMixpanel(AnalyticEvent.MONEY_GURU_LEARNING_MODULE_VIEWED, {
      moduleName: module.title,
    });
    router.push(`/learning-module/${id}`);
  }

  return (
    <div
      className={styles.gridItem}
      onClick={() => onClickModuleHandler({ id: module.id })}
    >
      <img
        src={module.image ?? LearningModuleData.moduleSubPlaceHolder}
        alt="learning_module"
      />
      <p className={styles.moduleTitle}>{module.title}</p>
      <p className={styles.chapterCount}>{module.chapters.length} Chapters</p>
    </div>
  );
};
