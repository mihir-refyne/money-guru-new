import LearningModuleData from "../../../data/learning_module.json";
import styles from "./LearningModule.module.css";

import { useRouter } from "next/router";
import { LearningModuleLayout } from "./LearningModuleLayout/LearningModuleLayout";

import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import YoutubePlayer from "../YoutubePlayer";
import { LearningModuleType } from "@/lib/utils/learningModulesFetcher";

export default function LearningModule({
  learningModulesData,
}: {
  learningModulesData: LearningModuleType[] | undefined;
}) {
  return (
    <LearningModuleLayout>
      <div className={styles.learningModule}>
        <div className={styles.imageContainer}>
          {/* <img
            src={LearningModuleData.defaultLearningModulePlaceHolderImage}
            alt="learning_module"
          /> */}

          <YoutubePlayer
            hideIfNotInView={false}
            url={"https://www.youtube.com/watch?v=IpYJjVw6wjU"}
            // className={styles.ShortMedia__Image}
            autoplay={true}
            fullscreen={false}
            modestBranding
            showRelatedVideos={false}
            loop
            controls={false}
            showOnlyThumbnail={false}
          />
          {/* <img
            className={styles.centerIcon}
            src={LearningModuleData.playIcon}
            alt="play_icon"
          /> */}
        </div>

        <div className={styles.titleContainer}>
          <h3
            className={`${styles.heading} text-heading text-semi-bold text-left my-2`}
          >
            Money Management
          </h3>
          <p className={`${styles.supportingTitle} text-regular`}>
            Supporting Title
          </p>
        </div>

        <div className={styles.moduleGrid}>
          {learningModulesData?.map((module, index) => (
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
        src={LearningModuleData.moduleSubPlaceHolder}
        alt="learning_module"
      />
      <p className={styles.moduleTitle}>{module.title}</p>
      <p className={styles.chapterCount}>{module.chapters.length} Chapters</p>
    </div>
  );
};
