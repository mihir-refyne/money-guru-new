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
  accordionItemStyle?: string;
  borderBottomStyle?: string;
  headerFontWeight?: string;
}

function AccordionItem({
  id,
  active = false,
  headerText,
  content,
  onClick,
  disabled,
  isLastItem,
  accordionItemStyle,
  borderBottomStyle,
  headerFontWeight,
}: AccordionItemProps & { isLastItem?: boolean }) {
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
    <div className={`${accordionItemStyle ?? ""}`}>
      <dt id={id}>
        <button
          aria-controls={accordionItemId}
          aria-expanded={isActive}
          className={`p-3 ${borderBottomStyle ?? ""} ${
            styles.Rf_Accordion__Header
          }${isActive ? " active" : ""}`}
          onClick={handleClick}
          disabled={disabled}
          style={{
            borderBottom:
              borderBottomStyle && !isActive ? "none" : "1px solid #F0F0F0",
            borderRadius: borderBottomStyle && "0",
          }}
        >
          <h5
            style={{
              fontWeight: headerFontWeight ?? "600",
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
      {!isLastItem && (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #F0F0F0",
            margin: 0,
          }}
        />
      )}
    </div>
  );
}

interface AccordionsProps {
  items: AccordionItemProps[];
  style?: string;
  accordionItemStyle?: string;
  hideBottomBorder?: boolean;
}

export default function Accordions({
  items,
  style,
  hideBottomBorder,
}: AccordionsProps) {
  return (
    <dl className={`${style} ${styles.Rf_Accordion}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          {...item}
          isLastItem={hideBottomBorder ?? index === items.length - 1}
        />
      ))}
    </dl>
  );
}
