import { CSSProperties, ReactElement } from "react";
import styles from "./styles.module.css";

type Orientation = "vertical" | "horizontal";
type SeparatorSpacing = 3 | 4 | 6;

const orientationToBorderColorKeyMap: Record<Orientation, string> = {
  vertical: "borderBottomColor",
  horizontal: "borderRightColor",
};
const orientationToBorderStyleKeyMap: Record<Orientation, string> = {
  vertical: "borderBottomStyle",
  horizontal: "borderRightStyle",
};

interface SeparatorProps {
  orientation?: Orientation;
  children: ReactElement[];
  separatorStyle?: CSSProperties["borderStyle"];
  separatorColor?: string;
  spacing?: SeparatorSpacing;
}

export default function Separator({
  orientation = "horizontal",
  children,
  separatorStyle,
  separatorColor,
  spacing = 6,
}: SeparatorProps) {
  return (
    <div
      className={`${styles.Separator__Wrapper} ${
        styles[`Separator__${orientation}`]
      } ${styles[`Separator__Spacing_${spacing}`]}`}
    >
      {children.map((childComponents, index) => {
        return (
          <div
            key={index}
            className={styles.Separator}
            style={{
              [orientationToBorderStyleKeyMap[orientation]]: separatorStyle,
              [orientationToBorderColorKeyMap[orientation]]: separatorColor,
            }}
          >
            {childComponents}
          </div>
        );
      })}
    </div>
  );
}
