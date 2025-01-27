import Image from "next/image";
import CheckIcon from "../../../../public/assets/images/two-wheeler-loan/checkbox_circle_fill.svg";
import ErrorIcon from "../../../../public/assets/images/two-wheeler-loan/error_icon.svg";
import styles from "./styles.module.css";

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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputContainer = ({
  value,
  label,
  hasError,
  errorMessage,
  hasSuccess,
  successResponse,
  isBorderDisabled = false,
  inputFieldType = "text",
  maxLength,
  onChange,
}: InputContainerProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const newValue = e.target.value;

    if (inputFieldType === "currency") {
      const numericValue = newValue.replace(/[^0-9.]/g, "");

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericValue,
        },
      };

      onChange(syntheticEvent);
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

  const displayValue =
    inputFieldType === "currency" && value
      ? `₹${Number(value).toLocaleString("en-IN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      : value;

  return (
    <div
      className={`${styles.input_container} ${
        isBorderDisabled && styles.input_container__border_none
      }`}
    >
      <p className={styles.input_field_label}>{label}</p>

      <div className={styles.input_field_wrapper}>
        <input
          maxLength={maxLength}
          className={`${styles.input_field} ${hasError && styles.error}`}
          onChange={handleInputChange}
          value={displayValue}
        />
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
