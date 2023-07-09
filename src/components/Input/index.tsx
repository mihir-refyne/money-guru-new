import React, { InputHTMLAttributes, ReactNode, useId } from "react";
import styles from "./styles.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightLabel?: ReactNode;
  hint?: string;
  error?: string;
}

export default function Input({
  label,
  rightLabel,
  hint,
  error,
  id,
  className,
  type = "text",
  ...rest
}: InputProps) {
  const _elementId = useId();

  const elementId = [_elementId, id].filter(Boolean).join("_");
  const _className = [styles.Input, "text-body text-medium", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div>
      {label && (
        <div className={styles.InputLabel__Wrapper}>
          <label htmlFor={elementId}>{label}</label>
          <div>{rightLabel}</div>
        </div>
      )}
      <input id={elementId} className={_className} type={type} {...rest} />
      <RenderHintOrError hint={hint} error={error} />
    </div>
  );
}

function RenderHintOrError(props: { hint?: string; error?: string }) {
  const { hint, error } = props;
  if (error) return <p className={styles.Input__Error}>{error}</p>;
  if (hint) return <p className={styles.Input__Hint}>{hint}</p>;
  return null;
}
