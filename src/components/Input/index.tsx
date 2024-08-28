import React, { InputHTMLAttributes, ReactNode, useId } from "react";
import styles from "./styles.module.css";
import { CopySimple } from "phosphor-react";
import { copyText } from "@/lib/clipboard";
import toast from "react-hot-toast";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightLabel?: ReactNode;
  hasCopyButton?: boolean;
  hint?: string;
  error?: string;
}

export default function Input({
  label,
  rightLabel,
  hint,
  error,
  hasCopyButton = false,
  id,
  className,
  type = "text",
  ...rest
}: InputProps) {
  const _elementId = useId();

  async function handleCopyClick() {
    const valueToBeCopied = rest.value?.toString();
    if (!valueToBeCopied) return;
    const result = await copyText(valueToBeCopied);
    if (result) {
      toast.success("Copied to clipboard", { id: "copy-success-toast" });
    }
  }

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
      <div
        className={`${styles.InputElem__Wrapper} ${
          hasCopyButton ? styles.HasCopyButton : ""
        }`}
      >
        <input id={elementId} className={_className} type={type} {...rest} />
        {hasCopyButton && (
          <button
            className={`btn btn-only-icon ${styles.InputCopyButton}`}
            onClick={handleCopyClick}
          >
            <CopySimple size={20} />
          </button>
        )}
      </div>
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
