import { useId } from "react";
import styles from "./styles.module.css";

type Orientation = "vertical" | "horizontal";
type FontSizeVariant = "title" | "sub-title" | "heading" | "body" | "caption";
type FontWeightVariant = "regular" | "medium" | "semibold";

type TextVariant = `${FontSizeVariant}_${FontWeightVariant}`;
type Type = "dark" | "light";
type Alignment = "left" | "center" | "right";

interface LabelValueProps<T> {
  type?: Type;
  label?: string;
  labelTextVariant?: TextVariant;
  orientation?: Orientation;
  value: T;
  valueTextVariant?: TextVariant;
  formatter?: (value: T) => string | number;
  align?: Alignment;
}

// TODO: Find a better name
export default function LabelValue<T extends string | number>({
  type = "dark",
  label,
  labelTextVariant = "caption_regular",
  orientation = "vertical",
  value,
  valueTextVariant = "heading_medium",
  formatter,
  align
}: LabelValueProps<T>) {
  const id = useId();

  const [labelTextSize, labelTextWeight] = labelTextVariant.split("_");
  const [valueTextSize, valueTextWeight] = valueTextVariant.split("_");

  const labelColor = type === "dark" ? "text-secondary" : "grey-dark";
  const valueColor = type === "dark" ? "text-primary" : "pure-white";

  const finalValue = formatter ? formatter(value) : value;

  return (
    <div
      className={
        `${styles.LabelValue}
        ${styles[`LabelValue__${orientation}`]}
        ${styles[`LabelValue__align_${align}`]}`
      }
    >
      {label && (
        <p
          id={id}
          className={`text-${labelTextSize} text-${labelTextWeight} clr-${labelColor} ${styles[`text_${align}`]}`}
        >
          {label}
        </p>
      )}
      <h5
        className={`text-${valueTextSize} text-${valueTextWeight} clr-${valueColor} ${styles[`text_${align}`]}`}
        aria-describedby={id}
      >
        {finalValue}
      </h5>
    </div>
  );
}
