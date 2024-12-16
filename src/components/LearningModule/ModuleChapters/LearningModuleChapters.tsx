import chevronRight from "@/images/chevron_right.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { LearningModuleLayout } from "../LearningModuleLayout/LearningModuleLayout";
import { useEffect, useState } from "react";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import styles from "./LearningModuleChapters.module.css";
import {
  Chapter,
  LearningModuleType,
  LearningModuleTypeResponseProps,
} from "@/lib/utils/learningModulesFetcher";

export const ModuleChapters = ({
  learningModulesDataResponse,
}: {
  learningModulesDataResponse: LearningModuleTypeResponseProps | undefined;
}) => {
  const router = useRouter();
  const { moduleId: id } = router.query;

  const [moduleData, setModuleData] = useState<LearningModuleType | null>(null);

  useEffect(() => {
    if (id) {
      const fetchedLearningModuleData =
        learningModulesDataResponse?.modules?.find(
          (mod) => mod.id === parseInt(id as string)
        ) as LearningModuleType;
      if (fetchedLearningModuleData) {
        setModuleData(fetchedLearningModuleData);
      }
    }
  }, [id]);

  if (!moduleData) {
    return <div>Loading...</div>;
  }

  return (
    <LearningModuleLayout hasContentPadding={false}>
      <>
        <ModuleDetailsTile
          title={moduleData.title}
          chapterCount={moduleData.chapters.length}
        />
        <ChaptersList moduleData={moduleData} chapters={moduleData.chapters} />
      </>
    </LearningModuleLayout>
  );
};

export const ModuleDetailsTile = ({
  title,
  chapterCount,
}: {
  title: string;
  chapterCount: number;
}) => {
  return (
    <div className={styles.ModuleDetailsTile_container}>
      <div className={styles.ModuleDetailsTile_content}>
        <p className={styles.ModuleDetailsTile_title}>{title}</p>
        <p className={styles.ModuleDetailsTile_chapter_count}>
          {chapterCount} Chapters
        </p>
      </div>
    </div>
  );
};

interface ChaptersListProps {
  moduleData: LearningModuleType;
  chapters: Chapter[];
}

const ChaptersList: React.FC<ChaptersListProps> = ({
  chapters,
  moduleData,
}) => {
  const colors = ["#FFF2F0", "#F0FFF2", "#EFF6FF"];
  const textColors = ["#D13B3B", "#01752F", "#003779"];
  const router = useRouter();

  const getColorIndex = (title: string): number => {
    return (
      title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      colors.length
    );
  };

  function onClickChapterTileHandler({ chapterId }: { chapterId: number }) {
    logEventInMixpanel(
      AnalyticEvent.MONEY_GURU_LEARNING_MODULE_CHAPTER_VIEWED,
      {
        moduleName: moduleData.title,
      }
    );
    const { moduleId } = router.query;
    router.push(`/learning-module/${moduleId}/chapter/${chapterId}`);
  }

  return (
    <div
      style={{
        padding: "16px",
      }}
    >
      {chapters.map((chapter, index) => (
        <ChapterTile
          key={index}
          chapter={chapter}
          countBgColor={colors[getColorIndex(chapter.title)]}
          index={index}
          onClick={() => onClickChapterTileHandler({ chapterId: chapter.id })}
          textColor={textColors[getColorIndex(chapter.title)]}
        />
      ))}
    </div>
  );
};

interface ChapterTileProps {
  chapter: Chapter;
  countBgColor: string;
  textColor: string;
  index: number;
  onClick: () => void;
}

export const ChapterTile: React.FC<ChapterTileProps> = ({
  chapter,
  countBgColor,
  textColor,
  index,
  onClick,
}) => {
  return (
    <div
      key={chapter.id}
      className={styles.ChapterTile_container}
      onClick={onClick}
    >
      <div
        className={styles.ChapterTile_count_container}
        style={{ backgroundColor: countBgColor }}
      >
        <p
          className={styles.ChapterTile_count_text}
          style={{ color: textColor }}
        >
          {String(index + 1).padStart(2, "0")}
        </p>
      </div>

      <div className={styles.ChapterTile_details}>
        <p className={styles.ChapterTile_title}>{chapter.title}</p>
        <p className={styles.ChapterTile_read_time}>
          Read time: {chapter.readTime}
        </p>
      </div>

      <Image src={chevronRight} alt="Navigate to chapter" />
    </div>
  );
};
