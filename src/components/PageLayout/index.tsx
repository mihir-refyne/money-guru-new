import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useState } from "react";
import LocaleUpdateOptions from "../LocaleUpdateOptions";
import Modal from "../Modal";
import Navbar from "../Navbar";
import styles from "./styles.module.css";

const DEFAULT_PAGE_TITLE = "Financial Literacy - Refyne";
const DEFAULT_PAGE_DESCRIPTION = "Financial Literacy module by Refyne";

interface PageLayoutProps {
  title?: string;
  description?: string;
  hasNavbar?: boolean;
  transparentNavbar?: boolean;
  navbarText?: string;
  hasBackButton?: boolean;
  children: ReactNode;
  hasContentPadding?: boolean;
  footer?: ReactElement;
}

export default function PageLayout({
  title = DEFAULT_PAGE_TITLE,
  description = DEFAULT_PAGE_DESCRIPTION,
  hasNavbar = true,
  transparentNavbar = false,
  navbarText,
  hasBackButton = true,
  footer,
  children,
  hasContentPadding = true,
}: PageLayoutProps) {
  const router = useRouter();
  const [isLocaleUpdateModalActive, setIsLocaleUpdateModalActive] =
    useState(false);

  function handleLocaleUpdateClick() {
    setIsLocaleUpdateModalActive(true);
  }

  function handleLocaleUpdate(locale: string) {
    router.replace(router.asPath, router.asPath, { locale });
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.PageLayout__Wrapper}>
        {hasNavbar && (
          <Navbar
            title={navbarText}
            hasBackButton={hasBackButton}
            transparentNavbar={transparentNavbar}
            onBackClick={router.back}
            onLocaleChangeClick={handleLocaleUpdateClick}
          />
        )}
        <div
          className={`${styles.PageLayout__Content} ${
            hasNavbar && transparentNavbar ? styles.NavbarOffset : ""
          } ${hasContentPadding ? styles.ContentPadding : ""}`}
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
          locales={router.locales}
          currentValue={router.locale ?? router.defaultLocale}
          onChange={handleLocaleUpdate}
        />
        <button className="btn btn-primary btn-block">Proceed</button>
      </Modal>
    </>
  );
}
