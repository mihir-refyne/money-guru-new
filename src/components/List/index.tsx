import React, { ReactElement } from "react";
import GreenTickImage from "@/images/green-tick.svg";
import Image from "next/image";
import styles from "./styles.module.css";

type ListType = "tick";

interface ListProps {
  type: ListType;
  items: Array<string>;
}

export function List({ type, items }: ListProps) {
  return (
    <ul className={styles.List}>
      {items.map((item, index) => (
        <ListItem key={index} type={type} value={item} />
      ))}
    </ul>
  );
}

interface ListWithCustomIconsProps {
  items: Array<{
    icon: ReactElement;
    text: string;
  }>;
}

export function ListWithCustomIcons({ items }: ListWithCustomIconsProps) {
  return (
    <ul className={styles.List}>
      {items.map((item, index) => (
        <ListItem key={index} customIcon={item.icon} value={item.text} />
      ))}
    </ul>
  );
}

interface ListItemProps {
  type?: ListType;
  customIcon?: ReactElement;
  value: string;
}

function ListItem({ type, customIcon, value }: ListItemProps) {
  if (type === "tick") {
    return (
      <li className={`${styles.ListItem} clr-text-secondary text-caption`}>
        <Image src={GreenTickImage} alt={value} className="mr-2" />
        <span>{value}</span>
      </li>
    );
  }
  return (
    <li className={`${styles.ListItem} clr-text-secondary text-caption`}>
      {customIcon && <div className={styles.ListItem__Icon}>{customIcon}</div>}
      <span>{value}</span>
    </li>
  );
}
