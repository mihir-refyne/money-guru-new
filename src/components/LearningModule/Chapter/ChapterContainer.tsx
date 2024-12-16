import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Chapter.module.css";
import { LearningModuleLayout } from "../LearningModuleLayout/LearningModuleLayout";
import chevronRight from "@/images/chevron_right.svg";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import {
  Chapter,
  LearningModuleTypeResponseProps,
  RShort,
} from "@/lib/utils/learningModulesFetcher";

export const ChapterContainer = ({
  learningModulesData,
}: {
  learningModulesData: LearningModuleTypeResponseProps | undefined;
}) => {
  const router = useRouter();
  const { moduleId, chapterId } = router.query;
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [currentRShortIndex, setCurrentRShortIndex] = useState(0);

  useEffect(() => {
    if (moduleId && chapterId) {
      const fetchedLearningModuleData = learningModulesData?.modules?.find(
        (mod) => mod.id === parseInt(moduleId as string)
      );

      if (fetchedLearningModuleData) {
        const chapter = fetchedLearningModuleData.chapters.find(
          (chap) => chap.id === parseInt(chapterId as string)
        );

        if (chapter) {
          logEventInMixpanel(
            AnalyticEvent.MONEY_GURU_LEARNING_MODULE_RSHORT_VIEWED,
            {
              moduleName: fetchedLearningModuleData.title,
              chapterName: chapter.title,
              //TODO: add rshortId here
            }
          );
          setChapterData(chapter);
        }
      }
    }
  }, [moduleId, chapterId]);

  if (!chapterData) {
    return <div>Loading...</div>;
  }

  const handlePrevious = () => {
    if (currentRShortIndex > 0) {
      setCurrentRShortIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentRShortIndex < chapterData.rShorts.length - 1) {
      setCurrentRShortIndex((prev) => prev + 1);
    }
  };

  const currentRShort = chapterData.rShorts[currentRShortIndex];

  return (
    <LearningModuleLayout hasContentPadding={false}>
      {/* Chapter Header */}
      <ChapterTile chapterData={chapterData} />
      {/* RShorts Content */}
      <RShortsContent currentRShort={currentRShort} />

      {/* Pagination */}
      <BottomPaginationBar
        chapterData={chapterData}
        currentRShortIndex={currentRShortIndex}
        handleNextOnClick={handleNext}
        handlePreviousOnClick={handlePrevious}
      />
    </LearningModuleLayout>
  );
};

const ChapterTile = ({ chapterData }: { chapterData: Chapter }) => {
  const getColorIndex = (title: string): number => {
    return (
      title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3
    );
  };

  const colorIndex = getColorIndex(chapterData.title);

  return (
    <div className={styles.ChapterTile}>
      <div
        className={`${styles.ChapterTile__Number} ${
          styles[`ChapterTile__Number--Color${colorIndex}`]
        }`}
      >
        <p
          className={`${styles.ChapterTile__NumberText} ${
            styles[`ChapterTile__NumberText--Color${colorIndex}`]
          }`}
        >
          {String(chapterData.id).padStart(2, "0")}
        </p>
      </div>

      <div className={styles.ChapterTile__Content}>
        <p className={styles.ChapterTile__Title}>{chapterData.title}</p>
        <p className={styles.ChapterTile__ReadTime}>
          Read time: {chapterData.readTime}
        </p>
      </div>
    </div>
  );
};

const RShortsContent = ({ currentRShort }: { currentRShort: RShort }) => {
  return (
    <div className={styles.RShortsContent}>
      {currentRShort && (
        <>
          {currentRShort.metadata.mediaUrl && (
            <div className={styles.RShortsContent__Media}>
              <img
                src={currentRShort.metadata.mediaUrl}
                alt={currentRShort.metadata.content_title}
                className={styles.RShortsContent__Image}
              />
            </div>
          )}
          <div
            dangerouslySetInnerHTML={{ __html: currentRShort.content }}
            className={styles.RShortsContent__Text}
          />
        </>
      )}
    </div>
  );
};

interface BottomPaginationBarProps {
  handlePreviousOnClick: () => void;
  handleNextOnClick: () => void;
  currentRShortIndex: number;
  chapterData: Chapter;
}

const BottomPaginationBar = ({
  handlePreviousOnClick,
  handleNextOnClick,
  currentRShortIndex,
  chapterData,
}: BottomPaginationBarProps) => {
  return (
    <div className={styles.PaginationBar}>
      <div className={styles.PaginationBar__Container}>
        <button
          onClick={handlePreviousOnClick}
          disabled={currentRShortIndex === 0}
          className={`${styles.PaginationBar__Button} ${styles["PaginationBar__Button--Previous"]}`}
        >
          <Image src={chevronRight} alt="right" />
        </button>

        <div className={styles.PaginationBar__Counter}>
          <span className={styles.PaginationBar__CurrentPage}>
            {currentRShortIndex + 1}
          </span>
          <span>/</span>
          <span>{chapterData.rShorts.length}</span>
        </div>

        <button
          onClick={handleNextOnClick}
          className={styles.PaginationBar__Button}
          disabled={currentRShortIndex === chapterData.rShorts.length - 1}
        >
          <Image src={chevronRight} alt="right" />
        </button>
      </div>
    </div>
  );
};
