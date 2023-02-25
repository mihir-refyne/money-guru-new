import { ArrowRight, Spinner } from "phosphor-react"
import { ReactNode, useEffect, useRef, useState } from "react"
import CircularSpinner from "../CircularSpinner";
import styles from "./styles.module.css"

const isTouchDevice = () => 'ontouchstart' in window.document.documentElement;
const SLIDER_INITIAL_POSTION_OFFSET = 6;
const SLIDER_WIDTH_OFFSET = 40;

interface SwipeButtonProps {
  onSuccessSwipe?: () => void;
  onUnfinishedSwipe?: () => void;
  children?: ReactNode;
  unlockedFallback?: ReactNode;
}

export default function SwipeButton({ onSuccessSwipe, onUnfinishedSwipe, children, unlockedFallback }: SwipeButtonProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [dragPercentage, setDragPercentage] = useState<number>(0);

  const isDragging = useRef<boolean>(false);
  const sliderLeft = useRef<number>(0);
  const startX = useRef<number>(0);
  const containerWidth = useRef<number>(0);

  const wrapperElemRef = useRef<HTMLDivElement | null>(null);
  const sliderElemRef = useRef<HTMLDivElement | null>(null);

  function updateSliderStyle(sliderLeft: number) {
    if (!sliderElemRef.current) return;
    const sliderLeftWithOffest = Math.min(sliderLeft + SLIDER_INITIAL_POSTION_OFFSET, containerWidth.current);
    sliderElemRef.current.style.left = (sliderLeftWithOffest / 10) + 'rem';
    setDragPercentage(sliderLeftWithOffest / containerWidth.current);
  }

  function handleFinish() {
    setIsUnlocked(true);
    onSuccessSwipe?.();
  }

  function onDrag<T extends MouseEvent | TouchEvent>(event: T) {
    if (isUnlocked) return;
    if (!isDragging.current) return;

    if (isTouchDevice()) {
      const e = event as TouchEvent;
      sliderLeft.current = Math.min(Math.max(0, e.touches[0].clientX - startX.current), containerWidth.current)
    } else {
      const e = event as MouseEvent;
      sliderLeft.current = Math.min(Math.max(0, e.clientX - startX.current), containerWidth.current);
    }
    updateSliderStyle(sliderLeft.current);
  }

  function onDragStop() {
    if (isUnlocked) return;
    if (!isDragging.current) return;

    isDragging.current = false;

    if (sliderLeft.current > containerWidth.current * 0.9) {
      sliderLeft.current = containerWidth.current;
      handleFinish();
    } else {
      sliderLeft.current = 0;
      onUnfinishedSwipe?.();
    }
    updateSliderStyle(sliderLeft.current);
  }

  useEffect(() => {
    if (wrapperElemRef.current) {
      containerWidth.current = wrapperElemRef.current.clientWidth - SLIDER_WIDTH_OFFSET;
    }
    if (isTouchDevice()) {
      document.addEventListener('touchmove', onDrag);
      document.addEventListener('touchend', onDragStop);

      return () => {
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', onDragStop);
      }
    } else {
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onDragStop);

      return () => {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onDragStop);
      }
    }
  }, [])

  function onDragStart<T extends React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>>(event: T) {
    if (isUnlocked) return;
    isDragging.current = true;
    if (isTouchDevice()) {
      const e = event as React.TouchEvent<HTMLDivElement>;
      startX.current = e.touches[0].clientX;
    } else {
      const e = event as React.MouseEvent<HTMLDivElement, MouseEvent>;
      startX.current = e.clientX;
    }
  }

  // TODO: Use it
  function onReset() {
    sliderLeft.current = 0;
    updateSliderStyle(sliderLeft.current);
    setIsUnlocked(false);
    setDragPercentage(0);
  }

  if (isUnlocked)
    return (
      <div className={styles.SwipeButton__Wrapper}>
        {unlockedFallback ?? <CircularSpinner size={24} />}
      </div>
    )

  const contentOpacity = Math.max(1 - dragPercentage, 0.3);

  return (
    <div className={styles.SwipeButton__Wrapper} ref={wrapperElemRef}>
      <div className={styles.SwipeButton__Slider} ref={sliderElemRef} onMouseDown={onDragStart}
        onTouchStart={onDragStart}>
        <ArrowRight size={24} />
      </div>
      <span className="text-semibold" style={{
        userSelect: "none",
        opacity: contentOpacity
      }}>{children}</span>
    </div>
  )
}
