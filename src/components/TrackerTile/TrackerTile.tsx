import { CSSProperties } from "react";
import { CaretRight } from "phosphor-react";
import styles from "./TrackerTile.module.css";
import useTranslation from "@/hooks/useTranslation";

export interface TrackerTileProps {
  orientation?: TrackerTileOrientation;
  headingText: string;
  name: string;
  descriptionText?: string;
  descriptionHighlightText?: string;
  imageUrl: string;
  tag?: {
    text: string;
    textColor: string;
    backgroundColor: string;
  };
  onClick?: () => void;
}

type TrackerTileOrientation = "horizontal" | "vertical";

const cardOrientationToClassNameMap: Record<TrackerTileOrientation, string> = {
  vertical: styles.TrackerTile__Wrapper__sm,
  horizontal: styles.TrackerTile__Wrapper__lg,
};

const ORIENTATION_TO_FLEX_DIRECTION_MAP: Record<
  TrackerTileOrientation,
  CSSProperties["flexDirection"]
> = {
  horizontal: "row",
  vertical: "column",
};

export default function TrackerTile({
  orientation = "horizontal",
  headingText,
  descriptionText,
  imageUrl,
  descriptionHighlightText,
  tag,
  onClick,
}: TrackerTileProps) {
  const { tWithoutTypeSafety } = useTranslation("common");

  return (
    <div
      className={cardOrientationToClassNameMap[orientation]}
      role="button"
      onClick={onClick}
    >
      <div
        className="flex-center"
        style={{
          gap: "1rem",
          flexDirection: ORIENTATION_TO_FLEX_DIRECTION_MAP[orientation],
        }}
      >
        <img src={imageUrl} alt="" />
        <div>
          <h2 className="text-heading text-semibold">
            {tWithoutTypeSafety(headingText)}
          </h2>
          {descriptionText && (
            <h4 className="text-caption text-regular clr-text-secondary">
              {tWithoutTypeSafety(descriptionText)}
              {descriptionHighlightText && (
                <span className="text-caption text-regular clr-text-primary">
                  &nbsp; {tWithoutTypeSafety(descriptionHighlightText)}
                </span>
              )}
            </h4>
          )}
        </div>
      </div>
      {orientation === "horizontal" && (
        <div>
          <CaretRight size={24} />
        </div>
      )}

      {tag && (
        <div
          style={{ background: tag.backgroundColor }}
          className={styles.TrackerTile__Floating__Tag}
        >
          <h4 style={{ color: tag.textColor }} className="text-caption">
            {tWithoutTypeSafety(tag.text)}
          </h4>
        </div>
      )}
    </div>
  );
}
