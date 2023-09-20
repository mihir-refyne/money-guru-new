import { CSSProperties, useEffect, useState } from "react";
import Image from "next/image";
import { CaretLeft, ShareNetwork } from "phosphor-react";
import languageIconUrl from "@/images/language-icon.svg";
import styles from "./styles.module.css";

const FULL_OPACITY_AT = 64;
const MULTIPLYING_FACTOR = 1 / FULL_OPACITY_AT;

interface NavbarProps {
  hasBackButton?: boolean;
  title?: string;
  transparentNavbar?: boolean;
  floating?: boolean;
  background?: CSSProperties["background"];
  onBackClick?: () => void;
  hasLocaleChange?: boolean;
  onLocaleChangeClick?: () => void;
  hasShare?: boolean;
  onShareClick?: () => void;
}

export default function Navbar({
  hasBackButton,
  title,
  transparentNavbar,
  floating = true,
  background,
  onBackClick,
  hasLocaleChange = true,
  onLocaleChangeClick,
  hasShare = true,
  onShareClick,
}: NavbarProps) {
  const [navbarOpacity, setNavbarOpacity] = useState<number>(0);

  function handleOpacityChangeOnScroll() {
    const opacity = window.scrollY * MULTIPLYING_FACTOR;
    if (opacity > 1) {
      setNavbarOpacity(1);
    } else {
      setNavbarOpacity(opacity);
    }
  }

  useEffect(() => {
    if (!transparentNavbar || !floating) return;
    window.addEventListener("scroll", handleOpacityChangeOnScroll);
    return () => {
      window.removeEventListener("scroll", handleOpacityChangeOnScroll);
    };
  }, []);

  const transparentNavbarStyle = transparentNavbar
    ? {
        background: `rgb(255, 255, 255, ${navbarOpacity})`,
        ...(navbarOpacity >= 1 ? { boxShadow: "0 0 10px #f5f5f5" } : {}),
      }
    : undefined;
  const navBackground = transparentNavbarStyle ?? { background };

  return (
    <nav
      className={`${styles.Navbar} ${floating ? styles.Floating : ""}`}
      style={navBackground}
    >
      <div className={styles.NavbarContent}>
        <div className={styles.NavbarContent__Left}>
          {hasBackButton && (
            <button className="btn-only-icon mr-2" onClick={onBackClick}>
              <CaretLeft size={24} />
            </button>
          )}
          <span>{title}</span>
        </div>
        {hasLocaleChange && (
          <button
            className={`${styles.NavbarContent__RightButton} btn-only-icon`}
            onClick={onLocaleChangeClick}
          >
            <Image src={languageIconUrl} alt="Language Change" />
          </button>
        )}
        {hasShare && (
          <button
            className={`${styles.NavbarContent__RightButton} btn-only-icon`}
            onClick={onShareClick}
          >
            <ShareNetwork
              weight="fill"
              color="var(--clr-brand-default)"
              size={20}
            />
          </button>
        )}
      </div>
    </nav>
  );
}
