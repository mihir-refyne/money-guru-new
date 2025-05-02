import { InputContainerProps } from "@/lib/carlease-journey";
import styles from "./styles.module.css";

export const FormFieldInputContainer = ({
  value,
  label,
  inputFieldType = "text",
  maxLength,
  placeHolderText,
  fontSize,
  fontWeight,
  color,
  hasError,
  errorMessage,
  onChange,
}: InputContainerProps) => {
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
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <p className={styles.input_field_label}>{label}</p>

      <div className={styles.input_field_wrapper}>
        <div className={styles.input_field_wrapper}>
          {inputFieldType === "currency" && (
            <span className={styles.currency_prefix}>₹</span>
          )}
          <input
            style={{
              fontSize,
              fontWeight,
              color,
              paddingLeft: inputFieldType === "currency" ? "28px" : "none",
            }}
            placeholder={placeHolderText}
            maxLength={maxLength}
            className={`${styles.input_field} ${hasError && styles.error}`}
            onChange={handleInputChange}
            value={formattedValue}
            type={inputFieldType === "date" ? inputFieldType : "text"}
          />
        </div>

        {hasError && (
          <p className={`${styles.input_field_response_text} ${styles.error}`}>
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};
