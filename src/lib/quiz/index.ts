import {
  getFromLocalStorage,
  getFromSessionStorage,
  setInLocalStorage,
  setInSessionStorage,
} from "../storage/browserstorage";

const QUIZ_RESPONSE_STORAGE_KEY = "__MonGuQuiz_Response";

interface QuizResponseInLocalStorage {
  completedAt?: Date;
}
interface QuizResponseInSessionStorage {
  skippedAt?: Date;
}

type StorageType = "local" | "session";

type QuizResponse<T = unknown> = T extends "local"
  ? QuizResponseInLocalStorage
  : T extends "session"
  ? QuizResponseInSessionStorage
  : QuizResponseInLocalStorage & QuizResponseInSessionStorage;

type QuizResponseInLocalStorageMap = Record<string, QuizResponseInLocalStorage>;
type QuizResponseInSessionStorageMap = Record<
  string,
  QuizResponseInSessionStorage
>;

type QuizResponseMap<T> = T extends "local"
  ? QuizResponseInLocalStorageMap
  : T extends "session"
  ? QuizResponseInSessionStorageMap
  : never;

function getQuizResponseMap<T extends StorageType>(
  storage: T
): QuizResponseMap<T> {
  const storageGetter =
    storage === "local" ? getFromLocalStorage : getFromSessionStorage;
  const historyAsString = storageGetter(QUIZ_RESPONSE_STORAGE_KEY);
  try {
    if (!historyAsString) throw new Error("Item not found");
    return JSON.parse(historyAsString);
  } catch (_) {
    return {} as QuizResponseMap<T>;
  }
}

function setQuizResponseMap<T extends StorageType>(
  storage: T,
  quizId: string,
  response: QuizResponse<T>
): boolean {
  const currentMap = getQuizResponseMap(storage);
  const updatedMap = { ...currentMap, [quizId]: response };
  try {
    const storageSetter =
      storage === "local" ? setInLocalStorage : setInSessionStorage;
    storageSetter(QUIZ_RESPONSE_STORAGE_KEY, JSON.stringify(updatedMap));
    return true;
  } catch (_) {
    return false;
  }
}

export function getQuizResponseById(quizId: string): QuizResponse | null {
  const currentResponseFromLocal = getQuizResponseMap("local")[quizId];
  const currentResponseFromSession = getQuizResponseMap("session")[quizId];
  if (!currentResponseFromLocal && !currentResponseFromSession) return null;
  return { ...currentResponseFromLocal, ...currentResponseFromSession };
}

export function isQuizCompleted(quizId: string): boolean {
  const quizResponse = getQuizResponseById(quizId);
  if (!quizResponse) return false;
  if (quizResponse.completedAt) return true;
  return false;
}

export function isQuizEitherCompletedOrSkipped(quizId: string): boolean {
  const quizResponse = getQuizResponseById(quizId);
  if (!quizResponse) return false;
  if (quizResponse.completedAt || quizResponse.skippedAt) return true;
  return false;
}

export function setQuizResponse(context: {
  quizId: string;
  action: "COMPLETED" | "SKIPPED";
  onDate?: Date;
}) {
  const { quizId, action, onDate = new Date() } = context;
  if (action === "COMPLETED") {
    setQuizResponseMap("local", quizId, { completedAt: onDate });
  }
  if (action === "SKIPPED") {
    setQuizResponseMap("session", quizId, { skippedAt: onDate });
  }
}
