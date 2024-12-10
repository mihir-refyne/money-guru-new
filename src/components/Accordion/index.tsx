import { CaretDown, CaretUp } from "phosphor-react";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

export interface AccordionItemProps {
  id: string;
  active?: boolean;
  headerText: string;
  content: React.ReactNode;
  onClick?(id: string, active: boolean): void;
  disabled?: boolean;
}

function AccordionItem({
  id,
  active = false,
  headerText,
  content,
  onClick,
  disabled,
  isLast,
}: AccordionItemProps & { isLast?: boolean }) {
  const accordionItemId = `accordion-${id}`;
  const [isActive, setIsActive] = useState(active);
  function handleClick() {
    if (onClick) onClick(id, isActive);
    setIsActive((prevState) => !prevState);
  }
  useEffect(() => {
    setIsActive(active);
  }, [active]);
  return (
    <>
      <dt id={id}>
        <button
          aria-controls={accordionItemId}
          aria-expanded={isActive}
          className={`p-3 ${styles.Rf_Accordion__Header}${
            isActive ? " active" : ""
          }`}
          onClick={handleClick}
          disabled={disabled}
          style={{ borderBottom: "1px solid #F0F0F0" }}
        >
          <h5
            style={{
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {headerText}
          </h5>
          <div>
            {isActive ? <CaretUp size={24} /> : <CaretDown size={24} />}
          </div>
        </button>
      </dt>
      <dd>
        <div
          id={accordionItemId}
          className={`${styles.Rf_Accordion__Body} ${
            isActive ? styles.active : ""
          }`}
        >
          {content}
        </div>
      </dd>
      {!isLast && (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #F0F0F0",
            margin: 0,
          }}
        />
      )}
    </>
  );
}

interface AccordionsProps {
  items: AccordionItemProps[];
}

export default function Accordions({ items }: AccordionsProps) {
  return (
    <dl className={styles.Rf_Accordion}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </dl>
  );
}
