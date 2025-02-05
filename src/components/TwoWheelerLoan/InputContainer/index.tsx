import Image from "next/image";
import CheckIcon from "../../../../public/assets/images/two-wheeler-loan/checkbox_circle_fill.svg";
import ErrorIcon from "../../../../public/assets/images/two-wheeler-loan/error_icon.svg";
import styles from "./styles.module.css";
import { forwardRef, Ref } from "react";

interface InputContainerProps {
  value?: string | number;
  label: string;
  hasError?: boolean;
  errorMessage?: string;
  hasSuccess?: boolean;
  successResponse?: string;
  isBorderDisabled?: boolean;
  inputFieldType?: "text" | "number" | "currency";
  maxLength?: number;
  isFieldMandatory?: boolean;
  placeHolderText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const _InputContainer = (
  {
    value,
    label,
    hasError,
    errorMessage,
    hasSuccess,
    successResponse,
    isBorderDisabled = false,
    inputFieldType = "text",
    maxLength,
    isFieldMandatory,
    placeHolderText,
    onChange,
    onFocus,
  }: InputContainerProps,
  ref?: Ref<HTMLInputElement>
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const newValue = e.target.value;

    if (inputFieldType === "currency") {
      const numericValue = newValue.replace(/[^0-9]/g, "");

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericValue,
        },
      };

      onChange(syntheticEvent);
      const input = e.target;
      const caretPosition = input.selectionStart;

      requestAnimationFrame(() => {
        const currentFormatted = formatWithCommas(numericValue);
        const previousFormatted = formatWithCommas(value?.toString() ?? "");

        const currentCommaShift =
          currentFormatted.slice(0, caretPosition || 0).split(",").length - 1;
        const previousCommaShift =
          previousFormatted.slice(0, caretPosition || 0).split(",").length - 1;

        const newCaretPosition =
          (caretPosition || 0) + (currentCommaShift - previousCommaShift);
        input.setSelectionRange(newCaretPosition, newCaretPosition);
      });
    } else if (inputFieldType === "number") {
      if (newValue === "") {
        onChange(e);
        return;
      }

      const isValidNumber = /^\d*$/.test(newValue);

      if (!isValidNumber) return;

      onChange(e);
    } else {
      onChange(e);
    }
  };

  const formatWithCommas = (num: string) =>
    num ? Number(num).toLocaleString("en-IN") : "";

  const formattedValue =
    inputFieldType === "currency" && value !== 0
      ? formatWithCommas(value?.toString() ?? "")
      : value;

  return (
    <div
      className={`${styles.input_container} ${
        isBorderDisabled && styles.input_container__border_none
      }`}
    >
      <p className={styles.input_field_label}>
        {label}
        {isFieldMandatory && "*"}
      </p>

      <div className={styles.input_field_wrapper}>
        <div className={styles.input_field_wrapper}>
          {inputFieldType === "currency" && (
            <span className={styles.currency_prefix}>₹</span>
          )}
          <input
            ref={ref}
            style={{
              paddingLeft: inputFieldType === "currency" ? "22px" : "none",
            }}
            placeholder={placeHolderText}
            maxLength={maxLength}
            className={`${styles.input_field} ${hasError && styles.error}`}
            onChange={handleInputChange}
            value={formattedValue}
            onFocus={onFocus}
          />
        </div>
        {(hasError || hasSuccess) && (
          <Image
            src={hasError ? ErrorIcon : CheckIcon}
            alt="Response Icon"
            className={styles.input_field_icon}
          />
        )}
      </div>

      {hasError && !hasSuccess && (
        <p className={`${styles.input_field_response_text} ${styles.error}`}>
          {errorMessage}
        </p>
      )}
      {hasSuccess && !hasError && (
        <p className={`${styles.input_field_response_text}`}>
          {successResponse}
        </p>
      )}
    </div>
  );
};

export const InputContainer = forwardRef<HTMLInputElement, InputContainerProps>(
  _InputContainer
);
