import { SurveyTriggerAction } from "@/lib/survey";

export function getSurveyTriggerFromStringValue(
  value?: string
): SurveyTriggerAction | null {
  if (!value) return null;
  const possibleActions: string[] = Object.values(SurveyTriggerAction);
  if (possibleActions.includes(value)) return value as SurveyTriggerAction;
  return null;
}
