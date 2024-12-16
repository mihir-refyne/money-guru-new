// import { getUserMetadata } from "@/lib/core/user-metadata";
// import { useLocalStorage } from "./useLocalStorage";

// export interface ReadProgress {
//   [userId: string]: {
//     completedRShorts: {
//       [key: string]: boolean; // key format: `${moduleId}_${chapterId}_${rShortId}`
//     };
//     completedChapters: {
//       [key: string]: boolean; // key format: `${moduleId}_${chapterId}`
//     };
//   };
// }

// // hooks/useReadProgress/constants.ts
// export const READ_PROGRESS_KEY = "mg_read_progress";

// // hooks/useReadProgress/index.ts

// export const useReadProgress = () => {
//   const userMetadata = getUserMetadata();
//   const userId = userMetadata?.id;

//   const [readProgress, setReadProgress] = useLocalStorage<ReadProgress>(
//     READ_PROGRESS_KEY,
//     {}
//   );

//   /**
//    * Generate keys for storage
//    */
//   const generateKeys = {
//     rShort: (
//       moduleId: string | number,
//       chapterId: string | number,
//       rShortId: string
//     ) => `${moduleId}_${chapterId}_${rShortId}`,
//     chapter: (moduleId: string | number, chapterId: string | number) =>
//       `${moduleId}_${chapterId}`,
//   };

//   /**
//    * Mark a rShort as read and check if chapter is complete
//    */
//   const markRShortAsRead = (
//     moduleId: string | number,
//     chapterId: string | number,
//     rShortId: string,
//     totalRShortsInChapter: number
//   ) => {
//     if (!userId) return;

//     const rShortKey = generateKeys.rShort(moduleId, chapterId, rShortId);
//     const chapterKey = generateKeys.chapter(moduleId, chapterId);

//     setReadProgress(({ prev }: { prev: ReadProgress }) => {
//       // Initialize user data if not exists
//       const userData = prev[userId] || {
//         completedRShorts: {},
//         completedChapters: {},
//       };

//       // Mark rShort as completed
//       userData.completedRShorts[rShortKey] = true;

//       // Count completed rShorts in this chapter
//       const completedCount = Object.keys(userData.completedRShorts).filter(
//         (key) => key.startsWith(`${moduleId}_${chapterId}`)
//       ).length;

//       // If all rShorts in chapter are completed, mark chapter as completed
//       if (completedCount === totalRShortsInChapter) {
//         userData.completedChapters[chapterKey] = true;
//       }

//       return {
//         ...prev,
//         [userId]: userData,
//       } as ReadProgress;
//     });
//   };

//   /**
//    * Check if a rShort is read
//    */
//   const isRShortRead = (
//     moduleId: string | number,
//     chapterId: string | number,
//     rShortId: string
//   ): boolean => {
//     if (!userId) return false;
//     const key = generateKeys.rShort(moduleId, chapterId, rShortId);
//     return !!readProgress[userId]?.completedRShorts[key];
//   };

//   /**
//    * Check if a chapter is completed
//    */
//   const isChapterCompleted = (
//     moduleId: string | number,
//     chapterId: string | number
//   ): boolean => {
//     if (!userId) return false;
//     const key = generateKeys.chapter(moduleId, chapterId);
//     return !!readProgress[userId]?.completedChapters[key];
//   };

//   /**
//    * Get chapter progress percentage
//    */
//   const getChapterProgress = (
//     moduleId: string | number,
//     chapterId: string | number,
//     totalRShorts: number
//   ): number => {
//     if (!userId || totalRShorts === 0) return 0;

//     const completedCount = Object.keys(
//       readProgress[userId]?.completedRShorts || {}
//     ).filter((key) => key.startsWith(`${moduleId}_${chapterId}`)).length;

//     return Math.round((completedCount / totalRShorts) * 100);
//   };

//   /**
//    * Reset chapter progress
//    */
//   const resetChapterProgress = (
//     moduleId: string | number,
//     chapterId: string | number
//   ) => {
//     if (!userId) return;

//     setReadProgress((prev: ReadProgress): ReadProgress => {
//       const userData = prev[userId] || {
//         completedRShorts: {},
//         completedChapters: {},
//       };

//       // Remove all rShorts for this chapter
//       const updatedRShorts = { ...userData.completedRShorts };
//       Object.keys(updatedRShorts).forEach((key) => {
//         if (key.startsWith(`${moduleId}_${chapterId}`)) {
//           delete updatedRShorts[key];
//         }
//       });

//       // Remove chapter completion status
//       const updatedChapters = { ...userData.completedChapters };
//       delete updatedChapters[generateKeys.chapter(moduleId, chapterId)];

//       return {
//         ...prev,
//         [userId]: {
//           completedRShorts: updatedRShorts,
//           completedChapters: updatedChapters,
//         },
//       };
//     });
//   };

//   return {
//     markRShortAsRead,
//     isRShortRead,
//     isChapterCompleted,
//     getChapterProgress,
//     resetChapterProgress,
//     userId,
//   };
// };
