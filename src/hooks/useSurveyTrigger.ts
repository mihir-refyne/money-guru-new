import { useEffect, useRef, useState } from "react";
import {
  SurveyTriggerAction,
  fetchSurveyByTrigger,
  postSurveyResponse,
} from "@/lib/survey";
import {
  SurveySparrowLifecycleEvent,
  surveySparrowLaunch,
} from "@/lib/survey/survey-sparrow";
import { getPreferredLocale } from "@/lib/locale";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { AnalyticEvent } from "@/lib/analytics/events";
import { isObjectEmpty } from "@/lib/utils";

const SurveyEventToAnalyticEventMap: Record<
  SurveySparrowLifecycleEvent,
  AnalyticEvent | null
> = {
  surveyLoadStarted: AnalyticEvent.SURVEY_QUES_SHOWN,
  surveyCompleted: AnalyticEvent.SURVEY_QUES_SUBMITTED,
  removeWindow: null,
};

interface UseSurveyTriggerResponse {
  dispatchAction(trigger: SurveyTriggerAction): void;
}

export function useSurveyTrigger(): UseSurveyTriggerResponse {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const eventListenerUnSubscriber = useRef<Function | null>(null);

  useEffect(() => {
    return cleanupLastEventListenerIfAvailable;
  }, []);

  function cleanupLastEventListenerIfAvailable() {
    if (eventListenerUnSubscriber.current) {
      eventListenerUnSubscriber.current();
      eventListenerUnSubscriber.current = null;
    }
  }

  function handleSurveyEvent(
    _event: string,
    context: {
      surveyId: string;
      triggerAction: string;
      token: string;
    }
  ) {
    const event = _event as SurveySparrowLifecycleEvent;
    const { surveyId, triggerAction, token } = context;
    if (event === SurveySparrowLifecycleEvent.SURVEY_COMPLETED) {
      postSurveyResponse(token).catch(() => {});
    }
    const analyticEvent = SurveyEventToAnalyticEventMap[event];
    if (!analyticEvent) return;
    logEventInMixpanel(analyticEvent, {
      survey_id: surveyId,
      trigger_action: triggerAction,
    });
  }

  async function fetchSurvey(triggerAction: SurveyTriggerAction) {
    try {
      setIsFetching(true);
      const survey = await fetchSurveyByTrigger(triggerAction);
      if (survey === null || isObjectEmpty(survey)) return;
      const locale = getPreferredLocale() ?? "en";
      const { encryptedUserId, surveyId, token, name, domain } = survey;
      const { removeEventListener } = surveySparrowLaunch({
        config: {
          account: domain,
          surveyName: name,
          widgetToken: token,
          encryptedUserId,
          sparrowLang: locale,
        },
        listener(event) {
          handleSurveyEvent(event, {
            surveyId,
            triggerAction,
            token,
          });
        },
      });
      eventListenerUnSubscriber.current = removeEventListener;
    } catch (_) {
    } finally {
      setIsFetching(false);
    }
  }

  function dispatchAction(trigger: SurveyTriggerAction) {
    if (isFetching) return;
    cleanupLastEventListenerIfAvailable();
    fetchSurvey(trigger);
  }

  return { dispatchAction };
}
