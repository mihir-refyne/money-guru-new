export interface LearningModuleTypeResponseProps {
  modules: LearningModuleType[];
  youtubeUrl: string;
}

export interface LearningModuleType {
  id: number;
  youtubeUrl: string;
  title: string;
  description: string;
  image: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: number;
  title: string;
  readTime: string;
  rShorts: RShort[];
}

interface RShortMetadata {
  mediaUrl: string;
  content_title: string;
}

export interface RShort {
  id: string;
  metadata: RShortMetadata;
  content: string;
}

export interface LearningModuleResponse {
  data: LearningModuleTypeResponseProps;
}

export interface LearningModuleError {
  error: string;
}

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL;
const LEARNING_MODULES_PATH = "learning-modules/learning_modules_data.json";

export const fetchLearningModules = async (): Promise<
  LearningModuleResponse | LearningModuleError
> => {
  if (!CDN_BASE_URL) {
    return { error: "CDN URL configuration missing" };
  }

  try {
    const moduleDataUrl = `${CDN_BASE_URL}/${LEARNING_MODULES_PATH}`;
    const response = await fetch(moduleDataUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch from CDN: ${response.statusText}`);
    }

    const data = await response.json();
    return { data: data };
  } catch (error) {
    console.error("Error fetching learning modules:", error);
    return { error: "Failed to fetch learning modules" };
  }
};
