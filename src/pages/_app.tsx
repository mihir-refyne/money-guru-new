import LoadingPage from "@/components/LoadingPage";
import { getOrUpdatePreferredLocale } from "@/lib/locale";
import "@/styles/globals.css";
import { Work_Sans } from "@next/font/google";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAndSetUserMetadataFromServer } from "@/lib/core/user";
import {
  getPlatformName,
  isScreenHeightLessThan,
  isStringAndNotEmpty,
} from "@/lib/utils";
import { getUserMetadata, setUserMetadata } from "@/lib/core/user-metadata";
import {
  initializeMixpanel,
  setMixpanelGlobalProperties,
  setUserIdInMixpanel,
} from "@/lib/analytics/mixpanel";
import WebengageScript from "@/scripts/webengage";
import {
  initializeWebengage,
  setUserIdInWebengage,
  setWebengageGlobalProperties,
} from "@/lib/analytics/webengage";
import DeviceRotatePromptOverlay from "@/components/DeviceRotatePromptOverlay";
import useScreenOrientation from "@/hooks/useScreenOrientation";
import ResetFontBoostingScript from "@/scripts/ResetFontBoosting";
import { Toaster } from "react-hot-toast";

const workSans = Work_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const screenOrientation = useScreenOrientation();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchAndSetUserUserMetadata(
    data: Record<string, string | string[] | undefined>
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
    }
    if (metadata?.status) {
      setMixpanelGlobalProperties("user_status", metadata.status);
      setWebengageGlobalProperties("user_status", metadata.status);
      setMixpanelGlobalProperties(
        "platform",
        getPlatformName(appPlatformName?.toString())
      );
      setWebengageGlobalProperties(
        "platform",
        getPlatformName(appPlatformName?.toString())
      );
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
      }
    );
    setIsLoading(false);
  }

  function setViewportVariable() {
    const vh = window.innerHeight * 0.01;
    console.log("Calculated vh ", vh);
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    if (!router.isReady) return;
    initializeMixpanel();
    initializeWebengage();

    onLoad();

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
    // TEMP HACK to not force on IDS pages
    if (router.pathname.includes("independence-day")) return;
    const locale = getOrUpdatePreferredLocale({
      selectedLocale: router.locale,
      defaultLocale: router.defaultLocale,
    });
    if (!locale || !router.locale) return;
    if (locale === router.locale) return;
    router.replace(router.asPath, undefined, {
      shallow: true,
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
      <style jsx global>{`
        * {
          font-family: ${workSans.style.fontFamily};
        }
      `}</style>
      <ResetFontBoostingScript />
      <WebengageScript />
      <DeviceRotatePromptOverlay active={isMobileAndLandscape} />
      {isLoading && <LoadingPage />}
      {!isLoading && <Component {...pageProps} />}
      <Toaster position="bottom-center" />
    </>
  );
}
