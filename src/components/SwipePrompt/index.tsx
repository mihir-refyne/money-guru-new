import { CaretDoubleDown, CaretDoubleUp } from "phosphor-react";
import { CSSProperties, ReactNode } from "react";
import styles from "./styles.module.css";

interface SwipePromptProps {
  active?: boolean;
  className?: string;
  id?: string;
  style?: CSSProperties;
  position?: "top" | "bottom";
  prompt?: string;
  children?: ReactNode;
}

export default function SwipePrompt({
  active = false,
  position,
  prompt,
  className,
  children,
  ...rest
}: SwipePromptProps) {
  if (!active || !position)
    return (
      <div {...rest} className={className}>
        {children}
      </div>
    );

  const _className = [
    styles.SwipePrompt,
    position === "top" ? styles.PositionTop : styles.PositionBottom,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div {...rest} className={_className}>
      {children}
      <div className={styles.SwipePrompt__PromptContent}>
        {getIconByPostion(position)}
        <p className="text-caption text-medium">{prompt}</p>
      </div>
    </div>
  );
}

function getIconByPostion(position: "top" | "bottom") {
  if (position === "top") return <CaretDoubleDown size={24} />;
  if (position === "bottom") return <CaretDoubleUp size={24} />;
}
