import React from "react";
import styles from "./styles.module.css";
import useTranslation from "@/hooks/useTranslation";

interface CalculatorProps {
  name: string;
  title: string;
  imageUrl: string;
  url: string;
  tag?: {
    text: string;
    textColor: string;
    backgroundColor: string;
  };
}

interface CalulatorsTileProps {
  calculators: CalculatorProps[];
  onCalculatorClick: (toolName: string, url: string) => void;
}

export default function CalculatorTiles({
  calculators,
  onCalculatorClick,
}: CalulatorsTileProps) {
  const { tWithoutTypeSafety } = useTranslation();
  const firstToolTagProp = calculators[0].tag;
  return (
    <div className={styles.Calculator__Tile}>
      {firstToolTagProp && (
        <div
          className={styles.Calculator__Tile__Tag}
          style={{
            background: firstToolTagProp.backgroundColor,
          }}
        >
          <h4
            style={{ color: firstToolTagProp.textColor }}
            className="text-caption"
          >
            {firstToolTagProp.text}
          </h4>
        </div>
      )}

      {calculators.map((tool) => {
        return (
          <div
            onClick={() => onCalculatorClick(tool.name, tool.url)}
            role="button"
            style={{ cursor: "pointer" }}
            key={tool.name}
          >
            <img
              src={tool.imageUrl}
              alt={tool.name}
              className={styles.Calculator__Tile__Image}
            />
            <article
              className="text-caption"
              dangerouslySetInnerHTML={{
                __html: tWithoutTypeSafety(tool.title),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
