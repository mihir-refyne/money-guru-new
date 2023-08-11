import { ReactElement } from "react";
import StampBackground from "./StampBackground";
import styles from "./styles.module.css";
import { CheckCircle } from "phosphor-react";

interface StampWrapperProps {
  count?: number;
  borderColor?: string;
  disabled?: boolean;
  checked?: boolean;
  disableWhenCountIsZero?: boolean;
  onClick?: () => void;
  children: ReactElement;
}

export default function StampWrapper({
  borderColor,
  count,
  disabled,
  checked,
  disableWhenCountIsZero = true,
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
      disabled={_disabled}
      onClick={onClick}
    >
      <StampBackground
        className={styles.StampWrapper__Background}
        fill={borderColor}
      />
      {hasCount && (
        <div className={styles.StampWrapper__Count}>
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
      <div className={styles.StampWrapper__Content}>{children}</div>
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
