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
      setMixpanelGlobalProperties(
        "platform",
        getPlatformName(appPlatformName?.toString())
      );
    }
    const locale = getOrUpdatePreferredLocale({
      selectedLocale: router.locale,
      defaultLocale: router.defaultLocale,
    });
    router.replace(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
        locale,
      }
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

    setViewportVariable();

    window.addEventListener("resize", setViewportVariable);
    return () => {
      window.removeEventListener("resize", setViewportVariable);
    };
  }, [router.isReady]);

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
