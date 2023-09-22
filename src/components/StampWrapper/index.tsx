import { CSSProperties, ReactElement } from "react";
import StampBackground from "./StampBackground";
import styles from "./styles.module.css";
import { CheckCircle } from "phosphor-react";

export type StampCountPosition = `${"top" | "bottom"}_${"left" | "right"}`;

function getCountPositionStyle(
  position: StampCountPosition
): Pick<CSSProperties, "left" | "right" | "top" | "bottom"> {
  // TODO: Move it to config
  const offset = "0";
  if (position === "top_left") {
    return {
      top: `${offset}rem`,
      bottom: "unset",
      left: `${offset}rem`,
      right: "unset",
    };
  }
  if (position === "bottom_left") {
    return {
      top: "unset",
      bottom: `${offset}rem`,
      left: `${offset}rem`,
      right: "unset",
    };
  }
  if (position === "bottom_right") {
    return {
      top: "unset",
      bottom: `${offset}rem`,
      left: "unset",
      right: `${offset}rem`,
    };
  }
  return {
    top: `${offset}rem`,
    right: `${offset}rem`,
  };
}

interface StampWrapperProps {
  count?: number;
  countDisplayPosition?: StampCountPosition;
  countBorderColor?: string;
  stampName?: string;
  displayStampName?: boolean;
  borderColor?: string;
  disabled?: boolean;
  checked?: boolean;
  disableWhenCountIsZero?: boolean;
  disableClickWhenDisabled?: boolean;
  hasBackground?: boolean;
  onClick?: () => void;
  children: ReactElement;
}

export default function StampWrapper({
  borderColor,
  count,
  countDisplayPosition = "top_right",
  countBorderColor,
  stampName,
  displayStampName = false,
  disabled,
  checked,
  disableWhenCountIsZero = false,
  disableClickWhenDisabled = true,
  hasBackground = false,
  onClick,
  children,
}: StampWrapperProps) {
  const RootElem = onClick ? "button" : "div";
  const hasCount = count !== undefined;
  const isCountZero = hasCount ? count <= 0 : false;
  const _disabled = (disableWhenCountIsZero && isCountZero) || disabled;
  const showStampName = displayStampName && !!stampName;
  return (
    <div className={styles.StampWrapper__Container}>
      <RootElem
        className={`${styles.StampWrapper} ${
          _disabled ? styles["StampWrapper--disabled"] : ""
        }`}
        disabled={disableClickWhenDisabled && _disabled}
        onClick={onClick}
      >
        <StampBackground
          className={styles.StampWrapper__Background}
          fill={borderColor}
          visible={hasBackground}
        />
        {hasCount && (
          <div
            className={styles.StampWrapper__Count}
            style={{
              ...getCountPositionStyle(countDisplayPosition),
              borderColor: countBorderColor,
            }}
          >
            <span className="text-caption text-medium">{count}</span>
          </div>
        )}
        {checked && (
          <div className={styles.StampWrapper__Checked}>
            <CheckCircle
              width="100%"
              height="100%"
              weight="fill"
              color="var(--clr-brand-default)"
            />
          </div>
        )}
        <div
          className={`${styles.StampWrapper__Content} ${
            hasBackground ? "" : styles.StampWrapper__Content__WithoutBg
          }`}
        >
          {children}
        </div>
      </RootElem>
      {showStampName && (
        <p className="text-caption text-medium text-center mt-1">{stampName}</p>
      )}
    </div>
  );
}

export function StampWrapperImage(props: { imageUrl: string; name?: string }) {
  return (
    <img
      src={props.imageUrl}
      alt={props.name}
      loading="lazy"
      width="100%"
      height="100%"
    />
  );
}
