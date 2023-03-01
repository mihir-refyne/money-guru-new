import LoadingPage from "@/components/LoadingPage";
import { getPreferredLocale } from "@/lib/locale";
import "@/styles/globals.css";
import { Work_Sans } from "@next/font/google";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAndSetUserMetadataFromServer } from "@/lib/core/user";
import { getPlatformName, isStringAndNotEmpty } from "@/lib/utils";
import { hasUserMetadata, setUserMetadata } from "@/lib/core/user-metadata";
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

const workSans = Work_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchAndSetUserUserMetadata(
    data: Record<string, string | string[] | undefined>
  ) {
    const {
      appPlatformName,
      userToken,
      userId,
      userName,
      userStatus,
      referralLink,
    } = data;
    try {
      if (!isStringAndNotEmpty(userToken)) throw new Error();
      return await getAndSetUserMetadataFromServer(userToken, {
        appPlatformName: appPlatformName?.toString(),
      });
    } catch (_) {
      if (hasUserMetadata()) return;
      const metadata = {
        id: userId?.toString(),
        name: userName?.toString(),
        status: userStatus?.toString(),
        referralLink: referralLink?.toString(),
        appPlatformName: appPlatformName?.toString(),
      };
      setUserMetadata(metadata);
      return metadata;
    }
  }

  async function onLoad() {
    const {
      appPlatformName,
      userToken,
      userId,
      userName,
      referralLink,
      ...restQuery
    } = router.query;
    const metadata = await fetchAndSetUserUserMetadata({
      appPlatformName,
      userToken,
      userId,
      userName,
      referralLink,
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
    const preferredLocale = getPreferredLocale();
    router.replace(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
        locale:
          preferredLocale === router.locale
            ? undefined
            : preferredLocale ?? false,
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

  return (
    <>
      <style jsx global>{`
        * {
          font-family: ${workSans.style.fontFamily};
        }
      `}</style>
      <WebengageScript />
      {isLoading && <LoadingPage />}
      {!isLoading && <Component {...pageProps} />}
    </>
  );
}
