import { CSSProperties, ReactElement, ReactNode, useState } from "react";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { getPreferredLocale, setPreferredLocale } from "@/lib/locale";
import { dispatchDataToNativePlatform } from "@/lib/webview";
import Head from "next/head";
import { useRouter } from "next/router";
import LocaleUpdateOptions from "../LocaleUpdateOptions";
import Modal from "../Modal";
import Navbar from "../Navbar";
import styles from "./styles.module.css";
import useTranslation from "@/hooks/useTranslation";

const DEFAULT_PAGE_TITLE = "Money Guru - Refyne";
const DEFAULT_PAGE_DESCRIPTION = "Financial Literacy module by Refyne";

interface Preload {
  as: "fetch";
  href: string;
  crossOrigin: "anonymous";
}

export interface PageLayoutProps {
  title?: string;
  description?: string;
  dispatchPopEventOnBackClick?: boolean;
  hasNavbar?: boolean;
  transparentNavbar?: boolean;
  floatingNavbar?: boolean;
  navbarText?: string;
  navbarBackground?: CSSProperties["background"];
  navbarFontColor?: CSSProperties["color"];
  hasBackButton?: boolean;
  children: ReactNode;
  alignContentCenter?: boolean;
  hasContentPadding?: boolean;
  hasLocaleChange?: boolean;
  hasShare?: boolean;
  onShareClick?: () => void;
  footer?: ReactElement;
  preloads?: Array<Preload>;
}

export default function PageLayout({
  title = DEFAULT_PAGE_TITLE,
  description = DEFAULT_PAGE_DESCRIPTION,
  hasNavbar = true,
  dispatchPopEventOnBackClick = false,
  transparentNavbar = false,
  floatingNavbar,
  navbarText,
  navbarBackground,
  navbarFontColor,
  hasBackButton = true,
  footer,
  children,
  alignContentCenter = false,
  hasLocaleChange = true,
  hasContentPadding = true,
  hasShare,
  onShareClick,
  preloads,
}: PageLayoutProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isLocaleUpdateModalActive, setIsLocaleUpdateModalActive] =
    useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>(
    getPreferredLocale() ?? router.locale ?? router.defaultLocale ?? ""
  );

  function handleLocaleUpdateClick() {
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_LANGUAGE_CHANGE_CLICK);
    setIsLocaleUpdateModalActive(true);
  }

  function handleLocaleUpdate() {
    setIsLocaleUpdateModalActive(false);
    setPreferredLocale(currentLocale);
    logEventInMixpanel(AnalyticEvent.FIN_LITERACY_LANGUAGE_SCREEN_PROCEED, {
      locale: currentLocale,
      location: "MODAL",
    });
    router.replace(router.asPath, undefined, {
      locale: currentLocale,
      shallow: false,
      scroll: false,
    });
  }

  function handleBack() {
    router.back();
    if (dispatchPopEventOnBackClick) {
      dispatchDataToNativePlatform({
        type: "POP",
      });
    }
  }

  const _hasShare = !hasLocaleChange && hasShare && !!onShareClick;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          httpEquiv="ScreenOrientation"
          content="autoRotate:disabled"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
        {preloads?.map((preload, index) => (
          <link key={index} rel="preload" {...preload} />
        ))}
      </Head>
      <main className={styles.PageLayout__Wrapper}>
        {hasNavbar && (
          <Navbar
            title={navbarText}
            hasBackButton={hasBackButton}
            transparentNavbar={transparentNavbar}
            floating={floatingNavbar}
            background={navbarBackground}
            fontColor={navbarFontColor}
            onBackClick={handleBack}
            hasLocaleChange={hasLocaleChange}
            onLocaleChangeClick={handleLocaleUpdateClick}
            hasShare={_hasShare}
            onShareClick={onShareClick}
          />
        )}
        <div
          className={`${styles.PageLayout__Content} ${
            hasNavbar && transparentNavbar ? styles.NavbarOffset : ""
          } ${hasContentPadding ? styles.ContentPadding : ""} ${
            alignContentCenter ? styles.ContentAlignCenter : ""
          }`}
        >
          {children}
        </div>
        {footer && (
          <footer className={styles.PageLayout__Footer}>{footer}</footer>
        )}
      </main>
      <Modal
        active={isLocaleUpdateModalActive}
        onClose={() => setIsLocaleUpdateModalActive(false)}
        bottomSheetOnMobile
      >
        <LocaleUpdateOptions
          // locales={router.locales}
          // INFO: This is hack for now, remove after Festival is done
          locales={["en", "hi"]}
          currentValue={currentLocale}
          onChange={setCurrentLocale}
        />
        <button
          className="btn btn-primary btn-block"
          onClick={handleLocaleUpdate}
        >
          {t("proceed")}
        </button>
      </Modal>
    </>
  );
}
