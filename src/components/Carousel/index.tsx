import React from "react";
import {
  Carousel as _Carousel,
  CarouselProps as _CarouselProps,
} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./styles.module.css";

interface CarouselProps extends Partial<_CarouselProps> {}

export default function Carousel({
  showArrows = false,
  showThumbs = false,
  showStatus = false,
  showIndicators = false,
  ...props
}: CarouselProps) {
  return (
    <div>
      <_Carousel
        showArrows={showArrows}
        showThumbs={showThumbs}
        showStatus={showStatus}
        showIndicators={showIndicators}
        {...props}
        renderIndicator={(indicatorOnClick, isSlideActive) => (
          <PaginationIndicator
            onClick={indicatorOnClick}
            isSlideActive={isSlideActive}
          />
        )}
      />
    </div>
  );
}

interface PaginationIndicatorProps {
  onClick: (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => void;
  isSlideActive: boolean;
}

function PaginationIndicator({
  onClick,
  isSlideActive,
}: PaginationIndicatorProps) {
  return (
    <button
      className={`${styles.CarouselIndicator} ${
        isSlideActive ? styles.CarouselIndicator__Active : ""
      }`}
      onClick={onClick}
    />
  );
}
