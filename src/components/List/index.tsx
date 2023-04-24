import React from "react";
import GreenTickImage from "@/images/green-tick.svg";
import Image from "next/image";
import styles from "./styles.module.css"

type ListType = "tick";

interface ListProps {
  type: ListType;
  items: Array<string>;
}

export default function List({ type, items }: ListProps) {
  return (
    <ul className={styles.List}>
      {items.map((item, index) => (
        <ListItem key={index} type={type} value={item} />
      ))}
    </ul>
  );
}

interface ListItemProps {
  type: ListType;
  value: string;
}

function ListItem({ type, value }: ListItemProps) {
  if (type === "tick")
    return (
      <li className="clr-text-secondary text-caption my-3">
        <Image src={GreenTickImage} alt={value} className="mr-2" />
        <span>{value}</span>
      </li>
    );
  return null;
}
