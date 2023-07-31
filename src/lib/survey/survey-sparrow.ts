import { getAbortControllerIfAvailable } from "../utils";

interface SurveySparrowWidgetLaunchConfig {
  widgetToken: string;
  account: string;
  surveyName: string;
  sparrowLang?: string;
  encryptedUserId?: string;
}

export enum SurveySparrowLifecycleEvent {
  SURVEY_LOAD_STARTED = "surveyLoadStarted",
  SURVEY_COMPLETED = "surveyCompleted",
  SURVEY_CLOSED = "removeWindow",
}

function surveySparrowWidgetLaunch(
  config: SurveySparrowWidgetLaunchConfig,
  options: Record<string, unknown> | null = null
) {
  const widgetId = "ss-widget";
  const scriptElem = document.getElementById("SS_SCRIPT");

  (<any>window).SS_WIDGET_TOKEN = config.widgetToken;
  (<any>window).SS_ACCOUNT = config.account;
  (<any>window).SS_SURVEY_NAME = config.surveyName;

  const isWidgetExists = !!document.getElementById(widgetId);

  if (isWidgetExists) {
    removeSurveySparrowWidget();
  }

  var SparrowLauncher = function (...args: Array<unknown>) {
    (<any>SparrowLauncher).update(args);
  };
  (<any>SparrowLauncher).args = [];
  (<any>SparrowLauncher).update = function (e: unknown) {
    (<any>SparrowLauncher).args.push(e);
  };
  (<any>window).SparrowLauncher = SparrowLauncher;

  const scriptElements = document.getElementsByTagName("script");
  const lastScriptElement = scriptElements.item(scriptElements.length - 1);
  let widgetUrl = `https://${config.account}/widget/${config.widgetToken}`;
  if (options) {
    widgetUrl += `?customParams=${JSON.stringify(options)}`;
    (<any>window).SS_VARIABLES = options;
  }

  const newScriptElement = document.createElement("script");
  newScriptElement.type = "text/javascript";
  newScriptElement.async = true;
  newScriptElement.id = widgetId;
  newScriptElement.src = widgetUrl;

  lastScriptElement?.parentNode?.insertBefore(
    newScriptElement,
    lastScriptElement
  );
  scriptElem?.parentNode?.removeChild(scriptElem);
}

function removeSurveySparrowWidget() {
  const elem = document.getElementById("ss-widget");
  elem?.parentNode?.removeChild(elem);

  // TODO: Check if we require this
  const launchElem = document.getElementById("ss_survey_widget");
  launchElem?.parentNode?.removeChild(launchElem);
}

export function surveySparrowLaunch(context: {
  config: SurveySparrowWidgetLaunchConfig;
  options?: Record<string, unknown> | null;
  listener?: (event: string, context?: Record<string, unknown>) => void;
}) {
  const { config, options = null, listener } = context;
  const { sparrowLang, encryptedUserId, ...restConfig } = config;
  const _options = {
    encryptedUserId: encryptedUserId ?? "unknown",
    sparrowLang: sparrowLang ?? "en",
    ...options,
  };
  surveySparrowWidgetLaunch(restConfig, _options);

  const controller = getAbortControllerIfAvailable();
  function removeEventListener() {
    controller?.abort();
  }
  window.addEventListener(
    "message",
    function surveyEventListener(e) {
      if (e?.data?.type === SurveySparrowLifecycleEvent.SURVEY_LOAD_STARTED) {
        listener?.(SurveySparrowLifecycleEvent.SURVEY_LOAD_STARTED);
      }
      if (e?.data?.type === SurveySparrowLifecycleEvent.SURVEY_CLOSED) {
        listener?.(SurveySparrowLifecycleEvent.SURVEY_CLOSED);
        window.removeEventListener("message", surveyEventListener);
        removeSurveySparrowWidget();
      }
      if (e?.data?.type === SurveySparrowLifecycleEvent.SURVEY_COMPLETED) {
        listener?.(SurveySparrowLifecycleEvent.SURVEY_COMPLETED, e.data);
        window.removeEventListener("message", surveyEventListener);
        removeSurveySparrowWidget();
      }
    },
    { signal: controller?.signal }
  );
  return { removeEventListener };
}
