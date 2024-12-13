import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

import { LearningModuleLayout } from "../LearningModuleLayout/LearningModuleLayout";
import chevronRight from "@/images/chevron_right.svg";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import {
  Chapter,
  LearningModuleType,
  RShort,
} from "@/lib/utils/learningModulesFetcher";

export const ChapterContainer = ({
  learningModulesData,
}: {
  learningModulesData: LearningModuleType[] | undefined;
}) => {
  const router = useRouter();
  const { moduleId, chapterId } = router.query;
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [currentRShortIndex, setCurrentRShortIndex] = useState(0);

  useEffect(() => {
    if (moduleId && chapterId) {
      // Find the module and then the chapter
      const fetchedLearningModuleData = learningModulesData?.find(
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
    <LearningModuleLayout hasContentPadding={true}>
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        backgroundColor: "#F7F7F7",
      }}
    >
      <button
        onClick={handlePreviousOnClick}
        disabled={currentRShortIndex === 0}
        style={{
          transform: "rotate(180deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src={chevronRight} alt="right" />
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: "600",
          fontSize: "16px",
          color: "#888888",
        }}
      >
        <span style={{ color: "#0057B7" }}>{currentRShortIndex + 1}</span>
        <span>/</span>
        <span>{chapterData.rShorts.length}</span>
      </div>

      <button
        onClick={handleNextOnClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        disabled={currentRShortIndex === chapterData.rShorts.length - 1}
      >
        <Image src={chevronRight} alt="right" />
      </button>
    </div>
  );
};

const RShortsContent = ({ currentRShort }: { currentRShort: RShort }) => {
  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        padding: "16px",
        // alignContent: "center",
        maxHeight: "100%",
      }}
    >
      {currentRShort && (
        <>
          {currentRShort.metadata.mediaUrl && (
            <div style={{ marginBottom: "16px" }}>
              <img
                src={currentRShort.metadata.mediaUrl}
                alt={currentRShort.metadata.content_title}
                style={{
                  width: " 100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "1.2rem",
                }}
              />
            </div>
          )}
          <div
            dangerouslySetInnerHTML={{ __html: currentRShort.content }}
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          />
        </>
      )}
    </div>
  );
};

const ChapterTile = ({ chapterData }: { chapterData: Chapter }) => {
  const colors = ["#FFF2F0", "#F0FFF2", "#EFF6FF"];
  const textColors = ["#D13B3B", "#01752F", "#003779"];

  const getColorIndex = (title: string): number => {
    return (
      title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      colors.length
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: colors[getColorIndex(chapterData.title)],
          borderRadius: "4px",
          textAlign: "center",
          marginRight: "8px",
        }}
      >
        <p
          style={{
            padding: "10px",
            color: textColors[getColorIndex(chapterData.title)],
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {String(chapterData.id).padStart(2, "0")}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <p style={{ margin: 0, fontWeight: "600" }}>{chapterData.title}</p>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            lineHeight: "16px",
            fontWeight: "400",
          }}
        >
          Read time: {chapterData.readTime}
        </p>
      </div>
    </div>
  );
};
