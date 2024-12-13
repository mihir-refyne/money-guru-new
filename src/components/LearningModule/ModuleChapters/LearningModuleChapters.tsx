import chevronRight from "@/images/chevron_right.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { LearningModuleLayout } from "../LearningModuleLayout/LearningModuleLayout";
import { useEffect, useState } from "react";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";

import {
  Chapter,
  LearningModuleType,
} from "@/lib/utils/learningModulesFetcher";

export const ModuleChapters = ({
  learningModulesData,
}: {
  learningModulesData: LearningModuleType[] | undefined;
}) => {
  const router = useRouter();
  const { moduleId: id } = router.query;

  // Get the id from URL
  const [moduleData, setModuleData] = useState<LearningModuleType | null>(null);

  useEffect(() => {
    if (id) {
      const fetchedLearningModuleData = learningModulesData?.find(
        (mod) => mod.id === parseInt(id as string)
      ) as LearningModuleType;
      if (module) {
        setModuleData(fetchedLearningModuleData);
      }
    }
  }, [id]);

  if (!moduleData) {
    return <div>Loading...</div>; // Or any loading state you prefer
  }

  return (
    <LearningModuleLayout hasContentPadding={false}>
      {/* module chapters lists */}
      <>
        <ModuleDetailsTile
          title={moduleData.title}
          chapterCount={moduleData.chapters.length}
        />

        <ChaptersList module={moduleData} chapters={moduleData.chapters} />
      </>
    </LearningModuleLayout>
  );
};

const ModuleDetailsTile = ({
  title,
  chapterCount,
}: {
  title: string;
  chapterCount: number;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "4px",
        padding: "16px",
        borderTop: "1px solid #F7F7F7",
        borderBottom: "1px solid #F7F7F7",
        borderRadius: "4px",
        backgroundColor: "#F7F7F7",
        boxSizing: "border-box",
      }}
    >
      {/* Left Section: Title and Chapters */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "600",
            margin: 0,
          }}
        >
          {title} {/* Stock market basics Stock */}
        </p>
        <p
          style={{
            fontSize: "12px",
            margin: 0,
            color: "#888",
          }}
        >
          {chapterCount} Chapters
        </p>
      </div>

      {/* Right Section: Progress */}
      <div
        style={{
          backgroundColor: "#01752F",
          color: "white",
          padding: "8px",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        0/{chapterCount}
      </div>
    </div>
  );
};

interface ChaptersListProps {
  module: LearningModuleType;
  chapters: Chapter[];
}

const ChaptersList: React.FC<ChaptersListProps> = ({ chapters, module }) => {
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
        moduleName: module.title,
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

const ChapterTile: React.FC<ChapterTileProps> = ({
  chapter,
  countBgColor,
  textColor,
  index,
  onClick,
}) => {
  return (
    <div
      key={chapter.id}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        marginBottom: "16px",
        cursor: "pointer",
        backgroundColor: "#FFFFFF",
        borderRadius: "4px",
        border: "1px solid #F0F0F0",
      }}
      onClick={onClick}
    >
      {/* Chapter Count with Color */}
      <div
        style={{
          backgroundColor: countBgColor,
          borderRadius: "4px",
          textAlign: "center",
          marginRight: "8px",
        }}
      >
        <p
          style={{
            padding: "10px",
            color: textColor,
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {" "}
          {String(index + 1).padStart(2, "0")}
        </p>
      </div>

      {/* Chapter Details */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <p style={{ margin: 0, fontWeight: "600" }}>{chapter.title}</p>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            lineHeight: "16px",
            fontWeight: "400",
          }}
        >
          Read time: {chapter.readTime}
        </p>
      </div>

      {/* Arrow Image */}
      <Image src={chevronRight} alt="Navigate to chapter" />
    </div>
  );
};
