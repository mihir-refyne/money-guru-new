import { ChangeEvent } from "react";
import styles from "./styles.module.css";

export interface CalculatorInputFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: "currency" | "number";
  hasError?: boolean;
  errorMessage?: string;
  onChange: (value: string) => void;
}

function formatWithCommas(value: string) {
  return value ? Number(value).toLocaleString("en-IN") : "";
}

export default function CalculatorInputField({
  label,
  value,
  placeholder,
  type = "number",
  hasError,
  errorMessage,
  onChange,
}: CalculatorInputFieldProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    onChange(numericValue);
  }

  const displayValue =
    type === "currency" ? formatWithCommas(value) : value;

  return (
    <div className={styles.CalculatorInputField}>
      <label className={styles.CalculatorInputField__Label}>{label}</label>
      <div className={styles.CalculatorInputField__Wrapper}>
        {type === "currency" && (
          <span className={styles.CalculatorInputField__Prefix}>₹</span>
        )}
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          className={`${styles.CalculatorInputField__Input} ${
            type === "currency" ? styles["CalculatorInputField__Input--currency"] : ""
          } ${hasError ? styles["CalculatorInputField__Input--error"] : ""}`}
        />
      </div>
      {hasError && errorMessage && (
        <p className={styles.CalculatorInputField__Error}>{errorMessage}</p>
      )}
    </div>
  );
}
