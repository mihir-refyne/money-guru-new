import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { getPreferredLocale, setPreferredLocale } from "@/lib/locale";
import { dispatchDataToNativePlatform } from "@/lib/webview";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import LocaleUpdateOptions from "../LocaleUpdateOptions";
import Modal from "../Modal";
import Navbar from "../Navbar";
import styles from "./styles.module.css";

const DEFAULT_PAGE_TITLE = "Money Guru - Refyne";
const DEFAULT_PAGE_DESCRIPTION = "Financial Literacy module by Refyne";
const SYNTHETIC_TIMEOUT_TO_CHECK_IF_BACK_ACTION_HAPPENED_IN_MS = 5;

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
  hasLocalButton?: boolean;
  children: ReactNode;
  alignContentCenter?: boolean;
  hasContentPadding?: boolean;
  hasLocaleChange?: boolean;
  hasShare?: boolean;
  onShareClick?: () => void;
  footer?: ReactElement;
  preloads?: Array<Preload>;
  pageBackground?: CSSProperties["background"];
  onNavbarBackClick?: () => void;
  toUnsetOverflowX?: boolean;
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
  hasLocalButton = true,
  footer,
  children,
  alignContentCenter = false,
  hasLocaleChange = true,
  hasContentPadding = true,
  hasShare,
  onShareClick,
  preloads,
  pageBackground,
  onNavbarBackClick,
  toUnsetOverflowX = false,
}: PageLayoutProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isLocaleUpdateModalActive, setIsLocaleUpdateModalActive] =
    useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>(
    getPreferredLocale() ?? router.locale ?? router.defaultLocale ?? ""
  );
  const isBackTriggerAvailable = useRef<boolean>(false);

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

  useEffect(() => {
    function handlePopState(this: Window, event: PopStateEvent) {
      isBackTriggerAvailable.current = true;
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function handleBack() {
    isBackTriggerAvailable.current = false;
    router.back();
    setTimeout(() => {
      if (!isBackTriggerAvailable.current) {
        dispatchDataToNativePlatform({
          type: "POP",
        });
        return;
      }
    }, SYNTHETIC_TIMEOUT_TO_CHECK_IF_BACK_ACTION_HAPPENED_IN_MS);
  }

  const _hasShare = !hasLocaleChange && hasShare && !!onShareClick;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
        />
        <meta
          httpEquiv="ScreenOrientation"
          content="autoRotate:disabled"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
        {preloads?.map((preload, index) => (
          <link key={index} rel="preload" {...preload} />
        ))}
      </Head>
      <main
        className={`${styles.PageLayout__Wrapper} ${
          toUnsetOverflowX && styles.UnsetOverflowX
        }`}
      >
        {hasNavbar && (
          <Navbar
            title={navbarText}
            hasBackButton={hasBackButton}
            hasLocalButton={hasLocalButton}
            transparentNavbar={transparentNavbar}
            floating={floatingNavbar}
            background={navbarBackground}
            fontColor={navbarFontColor}
            onBackClick={onNavbarBackClick || handleBack}
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
          style={{ background: pageBackground }}
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
