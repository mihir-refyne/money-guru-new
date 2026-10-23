import styles from "./LearningModule.module.css";

import { LearningModuleLayout } from "./LearningModuleLayout/LearningModuleLayout";

import { LearningModuleTypeResponseProps } from "@/lib/utils/learningModulesFetcher";
import VideoFillerBanner from "../VideoFillerBanner/VideoFillerBanner";
import LearningModuleGridItem from "./LearningModuleGridItem";

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
