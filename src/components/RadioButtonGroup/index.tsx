import { ChangeEvent } from "react";
import styles from "./styles.module.css";

interface RadioButtonItem {
  label: string;
  value: string;
}

interface RadioButtonGroupProps {
  items: RadioButtonItem[];
  name: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioButtonGroup({
  items,
  name,
  value,
  onChange,
}: RadioButtonGroupProps) {
  return (
    <ul className={styles.RadioButtonGroup} role="radiogroup">
      {items.map((item, index) => {
        const checked = item.value === value;
        return (
          <li key={index}>
            <label
              className={`${styles.RadioButtonGroup__Item} ${
                checked ? styles.ItemActive : ""
              }`}
            >
              <input
                className={styles.RadioButtonGroup__Item__input}
                type="radio"
                name={name}
                value={item.value}
                checked={checked}
                onChange={onChange}
              />
              <span className="text-heading text-semibold">{item.label}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
