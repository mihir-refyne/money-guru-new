import {
  ChangeEvent,
  useState,
  KeyboardEvent,
  useId,
  useMemo,
  useRef,
  useEffect,
  HTMLInputTypeAttribute,
} from "react";
import styles from "./styles.module.css";
import { isValueIsNumeric } from "@/lib/utils";

function getSplittedValues(
  numberOfInputs: number,
  value: string
): Array<string> {
  const _splittedValues = value.split("");

  const splittedValues: Array<string> = [];
  for (let i = 0; i < numberOfInputs; i++) {
    const value = _splittedValues[i] ?? "";
    splittedValues.push(value);
  }
  return splittedValues;
}

function getFieldId(baseId: string, index: number): string {
  return `SeparatedInput-${baseId}-${index}`;
}

function getFieldIds(numberOfInputs: number, baseId: string) {
  const ids: string[] = [];
  for (let i = 0; i < numberOfInputs; i++) {
    ids.push(getFieldId(baseId, i));
  }
  return ids;
}

function getPlaceholderValues(
  numberOfInputs: number,
  placeholder?: string
): Array<string> | undefined {
  if (!placeholder) return;
  if (placeholder.length !== numberOfInputs) return;
  return placeholder.split("");
}

interface SeparatedInputProps {
  type?: HTMLInputTypeAttribute;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  numberOfInputs?: number;
  autoFocus?: boolean;
  acceptOnlyNumber?: boolean;
}

export default function SeparatedInput({
  type = "text",
  label,
  value,
  onChange,
  numberOfInputs = 6,
  placeholder,
  autoFocus = false,
  acceptOnlyNumber = false,
}: SeparatedInputProps) {
  const elementId = useId();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const inputFieldIds = useMemo(
    () => getFieldIds(numberOfInputs, elementId),
    [numberOfInputs]
  );
  const splittedValues = useMemo(
    () => getSplittedValues(numberOfInputs, value),
    [value]
  );
  const placeholderValues = useMemo(
    () => getPlaceholderValues(numberOfInputs, placeholder),
    [placeholder]
  );

  const [activeInput, setActiveInput] = useState(0);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numberOfInputs);
  }, [numberOfInputs]);

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  function handleFocus(index: number) {
    return (event: React.FocusEvent<HTMLInputElement>) => {
      setActiveInput(index);
      event.target.select();
    };
  }

  function handleBlur() {
    setActiveInput(activeInput - 1);
  }

  function focusInputByIndex(index: number) {
    const activeInput = Math.max(Math.min(numberOfInputs - 1, index), 0);

    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput]?.focus();
      inputRefs.current[activeInput]?.select();
      setActiveInput(activeInput);
    }
  }

  function changeInputValueAtFocus(value: string) {
    const values = [...splittedValues];
    values[activeInput] = value[0];
    handleInputValueChange(values);
  }

  function handleInputValueChange(values: Array<string>) {
    const value = values.join("");
    onChange(value);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    if (acceptOnlyNumber && !isValueIsNumeric(value)) return;
    // INFO: This is to handle the paste case
    if (value.length === numberOfInputs) {
      return onChange(value);
    }
    changeInputValueAtFocus(value);
    focusInputByIndex(activeInput + 1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if ([event.code, event.key].includes("Backspace")) {
      event.preventDefault();
      changeInputValueAtFocus("");
      focusInputByIndex(activeInput - 1);
    } else if (event.code === "Delete") {
      event.preventDefault();
      changeInputValueAtFocus("");
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      focusInputByIndex(activeInput - 1);
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      focusInputByIndex(activeInput + 1);
    }
    // React does not trigger onChange when the same value is entered
    // again. So we need to focus the next input manually in this case.
    else if (event.key === splittedValues[activeInput]) {
      event.preventDefault();
      focusInputByIndex(activeInput + 1);
    } else if (
      event.code === "Spacebar" ||
      event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown"
    ) {
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && event.key === "v") {
      // INFO: Ignoring Ctrl/Cmd+v key press
    } else if (acceptOnlyNumber && !isValueIsNumeric(event.key)) {
      event.preventDefault();
    }
  }

  return (
    <fieldset className={styles.SeparatedInputBox_Wrapper}>
      {/* TODO: Implement label properly later */}
      {label && <legend>{label}</legend>}
      {inputFieldIds.map((inputFieldId, index) => (
        <input
          key={inputFieldId}
          ref={(element) => (inputRefs.current[index] = element)}
          id={inputFieldId}
          type={type}
          inputMode={acceptOnlyNumber ? "numeric" : undefined}
          name={index.toString()}
          onFocus={handleFocus(index)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          value={splittedValues[index]}
          onChange={handleChange}
          className={`${styles.SeparatedInputBox} text-sub-title`}
          placeholder={placeholderValues?.[index]}
          aria-label={`Please enter OTP character ${index + 1}`}
          autoComplete="off"
        />
      ))}
    </fieldset>
  );
}
