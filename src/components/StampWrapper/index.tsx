import { CSSProperties, ReactElement } from "react";
import StampBackground from "./StampBackground";
import styles from "./styles.module.css";
import { CheckCircle } from "phosphor-react";

type StampCountPosition = `${"top" | "bottom"}_${"left" | "right"}`;

function getCountPositionStyle(
  position: StampCountPosition
): Pick<CSSProperties, "left" | "right" | "top" | "bottom"> {
  if (position === "top_left") {
    return {
      top: "-0.8rem",
      bottom: "unset",
      left: "-0.8rem",
      right: "unset",
    };
  }
  if (position === "bottom_left") {
    return {
      top: "unset",
      bottom: "-0.8rem",
      left: "-0.8rem",
      right: "unset",
    };
  }
  if (position === "bottom_right") {
    return {
      top: "unset",
      bottom: "-0.8rem",
      left: "unset",
      right: "-0.8rem",
    };
  }
  return {
    top: "-0.8rem",
    right: "-0.8rem",
  };
}

interface StampWrapperProps {
  count?: number;
  countDisplayPosition?: StampCountPosition;
  countBorderColor?: string;
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
  return (
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
