import DashboardLoader from "@/components/DashboardLoader";
import DeviceRotatePromptOverlay from "@/components/DeviceRotatePromptOverlay";
import useScreenOrientation from "@/hooks/useScreenOrientation";
import {
  initializeMixpanel,
  logEventInMixpanel,
  setMixpanelGlobalProperties,
  setUserIdInMixpanel,
} from "@/lib/analytics/mixpanel";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { AnalyticEvent } from "@/lib/analytics/events";
import {
  initializePlotline,
  setLocaleInPlotline,
  setPlotlineEventsHandler,
  setPlotlineGlobalProperties,
} from "@/lib/analytics/plotline";
import {
  initializeWebengage,
  setUserIdInWebengage,
  setWebengageGlobalProperties,
} from "@/lib/analytics/webengage";
import { getAndSetUserMetadataFromServer } from "@/lib/core/user";
import { getUserMetadata, setUserMetadata } from "@/lib/core/user-metadata";
import { setMoneyGuruDeepLinkContext } from "@/lib/core/money-guru-session";
import { getOrUpdatePreferredLocale } from "@/lib/locale";
import {
  getPlatformName,
  isScreenHeightLessThan,
  isStringAndNotEmpty,
} from "@/lib/utils";
import { flutterNativeDispatcherV2Init } from "@/lib/webview";
import ResetFontBoostingScript from "@/scripts/ResetFontBoosting";
import PlotlineScript from "@/scripts/plotline";
import WebengageScript from "@/scripts/webengage";
import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const screenOrientation = useScreenOrientation();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchAndSetUserUserMetadata(
    data: Record<string, string | string[] | undefined>,
  ) {
    const { appPlatformName, userToken, userId, userName, userStatus } = data;
    try {
      if (!isStringAndNotEmpty(userToken)) throw new Error();
      return await getAndSetUserMetadataFromServer(userToken, {
        appPlatformName: appPlatformName?.toString(),
      });
    } catch (_) {
      const userMetadataFromCache = getUserMetadata();
      if (userMetadataFromCache) return userMetadataFromCache;
      const metadata = {
        id: userId?.toString(),
        name: userName?.toString(),
        status: userStatus?.toString(),
        appPlatformName: appPlatformName?.toString(),
      };
      setUserMetadata(metadata);
      return metadata;
    }
  }

  async function onLoad() {
    const { appPlatformName, userToken, userId, userName, ...restQuery } =
      router.query;
    const metadata = await fetchAndSetUserUserMetadata({
      appPlatformName,
      userToken,
      userId,
      userName,
    });
    if (metadata?.id) {
      setUserIdInMixpanel(metadata.id);
      setUserIdInWebengage(metadata.id);
      // For now initializing here, as plotline requires userId
      initializePlotline(metadata.id);
    }
    if (metadata?.status) {
      const userStatus = metadata.status;
      const platform = getPlatformName(appPlatformName?.toString());
      setMixpanelGlobalProperties("user_status", userStatus);
      setWebengageGlobalProperties("user_status", userStatus);
      setPlotlineGlobalProperties("user_status", userStatus);
      setMixpanelGlobalProperties("platform", platform);
      setWebengageGlobalProperties("platform", platform);
      setPlotlineGlobalProperties("platform", platform);
    }

    // Session QR deep link: ?session_id=...&employer_id=... opens Money
    // Guru. Persisted for the length of this session so later events
    // (pf_viewed, calculator_run, ...) can carry them via logMoneyGuruEvent.
    const { session_id: sessionId, employer_id: employerId } = router.query;
    if (isStringAndNotEmpty(sessionId)) {
      setMoneyGuruDeepLinkContext({
        sessionId: sessionId.toString(),
        employerId: isStringAndNotEmpty(employerId)
          ? employerId.toString()
          : undefined,
      });
      logMoneyGuruEvent(AnalyticEvent.DEEPLINK_OPENED);
    }

    router.replace(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );
    setIsLoading(false);
  }

  function setViewportVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    if (!router.isReady) return;
    initializeMixpanel();
    initializeWebengage();

    onLoad();

    setPlotlineEventsHandler(logEventInMixpanel);

    flutterNativeDispatcherV2Init();
    window.addEventListener("DOMContentLoaded", setViewportVariable, {
      once: true,
    });
    window.addEventListener("resize", setViewportVariable);
    return () => {
      window.removeEventListener("resize", setViewportVariable);
    };
  }, [router.isReady]);

  // INFO: This will force user preferred locale in route path
  useEffect(() => {
    if (router.locale) {
      setLocaleInPlotline(router.locale);
    }
    // TEMP HACK to not force on virtual-rewards-event pages
    if (router.pathname.includes("virtual-rewards-event")) return;
    const locale = getOrUpdatePreferredLocale({
      selectedLocale: router.locale,
      defaultLocale: router.defaultLocale,
    });
    if (!locale || !router.locale) return;
    if (locale === router.locale) return;
    router.replace(router.asPath, undefined, {
      scroll: false,
      locale,
    });
  }, [router.locale]);

  const isMobileAndLandscape =
    isScreenHeightLessThan(560) &&
    !!screenOrientation &&
    screenOrientation.startsWith("landscape");

  return (
    <>
      <NuqsAdapter>
        <style jsx global>{`
          * {
            font-family: ${inter.style.fontFamily};
            --font-inter: ${inter.style.fontFamily};
          }
        `}</style>
        <ResetFontBoostingScript />
        <WebengageScript />
        <PlotlineScript />
        <DeviceRotatePromptOverlay active={isMobileAndLandscape} />
        {isLoading && <DashboardLoader />}
        {!isLoading && <Component {...pageProps} />}
        <Toaster position="bottom-center" />
      </NuqsAdapter>
    </>
  );
}
