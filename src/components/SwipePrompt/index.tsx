import { CaretDoubleDown, CaretDoubleUp } from "phosphor-react";
import { CSSProperties, forwardRef, ReactNode, Ref } from "react";
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

function _SwipePrompt(
  {
    active = false,
    position,
    prompt,
    className,
    children,
    ...rest
  }: SwipePromptProps,
  ref: Ref<HTMLDivElement>
) {
  if (!active || !position)
    return (
      <div {...rest} className={className} ref={ref}>
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
    <div {...rest} className={_className} ref={ref}>
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

const SwipePrompt = forwardRef<HTMLDivElement, SwipePromptProps>(_SwipePrompt);
export default SwipePrompt;
