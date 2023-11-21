import { CORE_SERVER_BASE_URL } from "@/constants";
import { getValueFromMetadata } from "../core/user-metadata";
import { fetcher } from "../fetcher";

export enum SurveyTriggerAction {
  MONEY_GURU_DASHBOARD_OPEN = "MONEY_GURU_DASHBOARD_OPEN",
  MONEY_GURU_DASHBOARD_QUIZ_BANNER_CLICK = "MONEY_GURU_DASHBOARD_QUIZ_BANNER_CLICK",
  MONEY_GURU_CREDIT_REPORT_QUIZ_BANNER_CLICK = "MONEY_GURU_CREDIT_REPORT_QUIZ_BANNER_CLICK",
  MONEY_GURU_R_SHORT_SWIPE_UP = "MONEY_GURU_R_SHORT_SWIPE_UP",
  MONEY_GURU_COURSES_QUIZ_OPEN = "MONEY_GURU_COURSES_QUIZ_OPEN",
}

export interface Survey {
  encryptedUserId?: string;
  surveyId: string;
  token: string;
  name: string;
  domain: string;
}

export async function fetchSurveyByTrigger(
  triggerAction: SurveyTriggerAction
): Promise<Survey | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const survey = await fetcher<Survey>(
    `${CORE_SERVER_BASE_URL}/user/user-survey?triggerAction=${triggerAction}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return survey.data;
}

export async function postSurveyResponse(token: string): Promise<void> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return;
  await fetcher<Survey>(`${CORE_SERVER_BASE_URL}/user/survey-response`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    payload: {
      token,
    },
  });
}
