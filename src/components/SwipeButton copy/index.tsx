import { ArrowRight } from "phosphor-react"
import { useEffect, useRef } from "react"
import styles from "./styles.module.css"

function move(elem: any) {
  var left = 0
  function frame() {
      left++  // update parameters
      elem.style.left = left + 'px' // show frame
      if (left == 100)  // check finish condition
          clearInterval(id)
  }
  var id = setInterval(frame, 10) // draw every 10ms
}

export default function SwipeButton() {
  const wrapperElemRef = useRef<HTMLDivElement | null>(null);
  const sliderElemRef = useRef<HTMLDivElement | null>(null);
  const isMouseDown = useRef<boolean>(false);
  const initialMouse = useRef<number>(0);
  const totalSliderMovement = useRef<number>(0);

  function handleTouchStart(e: TouchEvent | MouseEvent) {
    isMouseDown.current = true;
    totalSliderMovement.current = (wrapperElemRef.current?.clientWidth ?? 0) - (e.currentTarget as any).clientWidth + 10;
    initialMouse.current = (e as MouseEvent).clientX ?? (e as TouchEvent).touches[0].pageX;
  }

  function handleTouchEnd(e: TouchEvent | MouseEvent) {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;

    const currentMouse = (e as MouseEvent).clientX ?? (e as TouchEvent)?.changedTouches[0]?.pageX;
    const relativeMouse = currentMouse - initialMouse.current;
    if (relativeMouse < totalSliderMovement.current) {
      console.log({ currentMouse, relativeMouse, total: totalSliderMovement.current })
      const currentLeft = sliderElemRef.current?.style.left;
      // if (sliderElemRef.current) {
      //   sliderElemRef.current.style.left = `calc(${currentLeft} + 10px)`;
      // }
      return;
    }
  }

  function handleTouchMove(e: TouchEvent | MouseEvent) {
    if (!isMouseDown.current) return;
      var currentMouse = (e as MouseEvent).clientX ?? (e as TouchEvent).touches[0].pageX;
      var relativeMouse = currentMouse - initialMouse.current;
      var slidePercent = 1 - (relativeMouse / totalSliderMovement.current);

      if (relativeMouse <= 0) {
        sliderElemRef.current && (sliderElemRef.current.style.left = "0.6rem")
        return;
      }
      if (relativeMouse >= totalSliderMovement.current + 10) {
        sliderElemRef.current && (sliderElemRef.current.style.left = totalSliderMovement.current + "px")
        return;
      }
      sliderElemRef.current && (sliderElemRef.current.style.left = `${relativeMouse - 10}px`)
  }

  useEffect(() => {
    sliderElemRef.current?.addEventListener("touchstart", handleTouchStart);
    sliderElemRef.current?.addEventListener("mousedown", handleTouchStart);
    sliderElemRef.current?.addEventListener("touchend", handleTouchEnd);
    sliderElemRef.current?.addEventListener("mouseup", handleTouchEnd);
    document.body.addEventListener("touchmove", handleTouchMove);
    document.body.addEventListener("mousemove", handleTouchMove);

    return () => {
      sliderElemRef.current?.removeEventListener("touchstart", handleTouchStart);
      sliderElemRef.current?.removeEventListener("mousedown", handleTouchStart);
      sliderElemRef.current?.removeEventListener("touchend", handleTouchEnd);
      sliderElemRef.current?.removeEventListener("mouseup", handleTouchEnd);
      document.body.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("mousemove", handleTouchMove);
    }
  }, [])

  return (
    <div className={styles.SwipeButton__Wrapper} ref={wrapperElemRef}>
      <div className={styles.SwipeButton__Slider} ref={sliderElemRef}>
        <ArrowRight size={24} />
      </div>
      <span className="text-semibold">Swipe To Unlock</span>
    </div>
  )
}
