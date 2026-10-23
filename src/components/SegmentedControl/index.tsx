import styles from "./styles.module.css";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: Array<SegmentedControlOption<T>>;
  value: T;
  onChange: (value: T) => void;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className={styles.SegmentedControl} role="tablist">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.SegmentedControl__Option} ${
              isActive ? styles["SegmentedControl__Option--active"] : ""
            }`}
            onClick={() => !isActive && onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
