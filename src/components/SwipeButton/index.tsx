import { ArrowRight } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import { useSwipeable } from "react-swipeable"
import styles from "./styles.module.css"

function findLeft(element: HTMLElement) {
  var rec = element.getBoundingClientRect();
  return rec.left + window.scrollX;
}

const minSwipeVelocity = 0.5
const minSwipeWidth = 0.6

export default function SwipeButton() {
  const [sliderLeftOffset, setSliderLeftOffset] = useState<number>(0);
  const wrapperElemRef = useRef<HTMLDivElement | null>(null);
  const sliderElemRef = useRef<HTMLDivElement | null>(null);

  const isSwipeCompleted = useRef<boolean>(false);


  const handlers = useSwipeable({
    onSwipedRight(data) {
      if (isSwipeCompleted.current || !wrapperElemRef.current)
        return;
      const butWidth = wrapperElemRef.current.offsetWidth;
      if (data.velocity > minSwipeVelocity) {
        isSwipeCompleted.current = true;
        console.log("DONE")
        setSliderLeftOffset(butWidth)
      }
      else {
        const offsetLeft = findLeft(wrapperElemRef.current);
        const startPos = Math.abs(data.initial[0] - offsetLeft);
        if (startPos <= 100 &&
          (data.event.type === "touchend" ? (data.event as TouchEvent).changedTouches[0].clientX - offsetLeft : (data.event as MouseEvent).offsetX) > minSwipeWidth * butWidth
        ) {
          isSwipeCompleted.current = true;
          console.log("DONE")
          setSliderLeftOffset(butWidth)
        } else {
          setSliderLeftOffset(40)
        }
      }
    },
    onSwiping(data) {
      if (isSwipeCompleted.current || !wrapperElemRef.current)
        return;
      const offsetLeft = findLeft(wrapperElemRef.current);
      const startPos = Math.abs(data.initial[0] - offsetLeft);
      if (startPos <= 100) {
        if (data.event.type && data.event.type === "touchmove")
          setSliderLeftOffset((data.event as TouchEvent).touches[0].clientX - offsetLeft);
        else
          setSliderLeftOffset((data.event as MouseEvent).offsetX);
      }
    },
    delta: 10,
    trackMouse: true,
  })

  return (
    <div className={styles.SwipeButton__Wrapper} {...handlers} ref={r => {
      handlers.ref(r);
      wrapperElemRef.current = r;
    }}>
      <div className={styles.SwipeButton__Slider} ref={sliderElemRef} style={{
        left: `calc(0.6rem + ${sliderLeftOffset}px)`
      }}>
        <ArrowRight size={24} />
      </div>
      <span className="text-semibold" style={{
        userSelect: "none"
      }}>Swipe To Unlock</span>
    </div>
  )
}
