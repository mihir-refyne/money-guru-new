import { useEffect, useRef, useState } from "react";
import {
  Survey,
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

interface UseSurveyTriggerProps {
  onLoad?: () => void;
  onComplete?: () => void;
  onNotFound?: () => void;
}

interface UseSurveyTriggerResponse {
  isFetching: boolean;
  isSurveyWindowLoading: boolean;
  prefetch(trigger: SurveyTriggerAction): void;
  dispatchAction(trigger: SurveyTriggerAction): void;
}

export function useSurveyTrigger({
  onLoad,
  onComplete,
  onNotFound,
}: UseSurveyTriggerProps = {}): UseSurveyTriggerResponse {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSurveyWindowLoading, setIsSurveyWindowLoading] =
    useState<boolean>(false);
  const cachedSurveyMap = useRef<Map<SurveyTriggerAction, Survey>>(new Map());
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

  function clearSurveyCache(trigger: SurveyTriggerAction): boolean {
    return cachedSurveyMap.current.delete(trigger);
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
    if (event === SurveySparrowLifecycleEvent.SURVEY_LOAD_STARTED) {
      setIsSurveyWindowLoading(false);
      onLoad?.();
    }
    if (event === SurveySparrowLifecycleEvent.SURVEY_CLOSED) {
      setIsSurveyWindowLoading(false);
    }
    if (event === SurveySparrowLifecycleEvent.SURVEY_COMPLETED) {
      clearSurveyCache(triggerAction as SurveyTriggerAction);
      postSurveyResponse(token)
        .catch(() => {})
        .finally(onComplete);
    }
    const analyticEvent = SurveyEventToAnalyticEventMap[event];
    if (!analyticEvent) return;
    logEventInMixpanel(analyticEvent, {
      survey_id: surveyId,
      trigger_action: triggerAction,
    });
  }

  async function getOrFetchSurvey(
    triggerAction: SurveyTriggerAction,
    force: boolean = false
  ): Promise<Survey | null> {
    const cachedSurvey = cachedSurveyMap.current.get(triggerAction);
    if (cachedSurvey && !force) return cachedSurvey;
    const survey = await fetchSurveyByTrigger(triggerAction);
    if (!survey || isObjectEmpty(survey)) return null;
    cachedSurveyMap.current.set(triggerAction, survey);
    return survey;
  }

  async function fetchSurveyAndTrigger(
    triggerAction: SurveyTriggerAction,
    forceFetch: boolean = false
  ) {
    try {
      setIsFetching(true);
      const survey = await getOrFetchSurvey(triggerAction, forceFetch);
      if (survey === null || isObjectEmpty(survey)) {
        onNotFound?.();
        return;
      }
      const locale = getPreferredLocale() ?? "en";
      const { encryptedUserId, surveyId, token, name, domain } = survey;
      setIsSurveyWindowLoading(true);
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

  function prefetch(trigger: SurveyTriggerAction): void {
    getOrFetchSurvey(trigger).catch(() => {});
  }

  function dispatchAction(
    trigger: SurveyTriggerAction,
    force: boolean = false
  ) {
    if (isFetching) return;
    cleanupLastEventListenerIfAvailable();
    fetchSurveyAndTrigger(trigger, force);
  }

  return { isFetching, isSurveyWindowLoading, prefetch, dispatchAction };
}
