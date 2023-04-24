import { ChangeEvent } from "react";
import styles from "./styles.module.css";

interface RadioButtonItem {
  label?: string;
  value: string;
  imageUrl?: string;
}

interface RadioButtonGroupProps {
  items: RadioButtonItem[];
  name: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  columnsPerLine?: number;
}

export default function RadioButtonGroup({
  items,
  name,
  value,
  onChange,
  columnsPerLine = 2
}: RadioButtonGroupProps) {
  return (
    <ul className={styles.RadioButtonGroup} role="radiogroup" style={{
      gridTemplateColumns: `repeat(${columnsPerLine}, 1fr)`
    }}>
      {items.map((item, index) => {
        const checked = item.value === value;
        return (
          <li key={index}>
            <label
              className={`${styles.RadioButtonGroup__Item} ${
                checked ? styles.ItemActive : ""
              } ${item.imageUrl ? styles.ImageItem : ""}`}
            >
              <input
                className={styles.RadioButtonGroup__Item__input}
                type="radio"
                name={name}
                value={item.value}
                checked={checked}
                onChange={onChange}
              />
              {item.imageUrl && <img src={item.imageUrl} alt={item.value} />}
              {item.label && <span className="text-heading text-semibold">{item.label}</span>}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
