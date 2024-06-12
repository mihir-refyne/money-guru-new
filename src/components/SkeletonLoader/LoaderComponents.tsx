import React from "react";
import styles from "./styles.module.css";

interface BaseLoaderProps {
  className?: string;
  background?: string;
  height?: string;
  width?: string;
  borderRadius?: number;
}

interface GridLoaderProps extends BaseLoaderProps {
  columnCount?: number;
  rowCount?: number;
}

interface CardLoaderProps extends BaseLoaderProps {
  cardCount?: number;
}

export default function SkeletonLine(props: React.CSSProperties) {
  return <div className={styles.Skeleton__Line} style={props}></div>;
}

export function GridLoader({
  columnCount = 3,
  rowCount = 2,
  className,
  background,
  height = "100px",
  borderRadius,
  width,
}: GridLoaderProps) {
  return (
    <>
      {Array(rowCount)
        .fill(null)
        .map((_, index) => (
          <div className={`row ${className}`} key={index}>
            {Array(columnCount)
              .fill(null)
              .map((_, index) => (
                <div className={`col-${12 / columnCount}`} key={index}>
                  <SkeletonLine
                    width={width}
                    backgroundImage={background}
                    height={height}
                    borderRadius={borderRadius}
                  />
                </div>
              ))}
          </div>
        ))}
    </>
  );
}

export function CardLoader({
  cardCount = 3,
  className,
  background,
  borderRadius = 12,
}: CardLoaderProps) {
  return (
    <div className={className}>
      {Array(cardCount)
        .fill(null)
        .map((_, index) => (
          <SkeletonLine
            key={index}
            height="10rem"
            borderRadius={borderRadius}
            backgroundImage={background}
          />
        ))}
    </div>
  );
}

export function BoxLoader({ background, className, ...rest }: BaseLoaderProps) {
  return (
    <div className={className}>
      <SkeletonLine backgroundImage={background} {...rest} />
    </div>
  );
}
