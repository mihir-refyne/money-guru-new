import { CSSProperties, ReactElement } from "react";
import styles from "./styles.module.css";

interface StampPodiumProps {
  bottomBorderColor?: string;
  children:
    | ReactElement<StampPodiumStageProps>
    | Array<ReactElement<StampPodiumStageProps>>;
}

export function StampPodium({ bottomBorderColor, children }: StampPodiumProps) {
  const style: CSSProperties | undefined = bottomBorderColor
    ? {
        borderBottom: `0.2rem solid ${bottomBorderColor}`,
      }
    : undefined;
  return (
    <div className={styles.StampPodium} style={style}>
      {children}
    </div>
  );
}

interface StampPodiumStageProps {
  backgroundColor?: string;
  background?: CSSProperties["background"];
  borderRadius?: string;
  children: Array<ReactElement>;
}

export function StampPodiumStage({
  backgroundColor,
  background,
  borderRadius,
  children,
}: StampPodiumStageProps) {
  return (
    <div
      className={styles.StampPodiumStage}
      style={{ background, backgroundColor, borderRadius }}
    >
      {children}
    </div>
  );
}
