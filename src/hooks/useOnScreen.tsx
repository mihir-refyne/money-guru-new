import { useEffect, useRef, useState } from "react";

type ScrollDirection = "UP" | "DOWN";

export function useOnScreen<T extends HTMLElement>(props: {
  options?: IntersectionObserverInit;
  onEnter?: (scrollDirection?: ScrollDirection) => void;
  onLeave?: (scrollDirection?: ScrollDirection) => void;
}) {
  const { options, onEnter, onLeave } = props;
  const ref = useRef<T | null>(null);

  const previousY = useRef<number>(0);
  const previousRatio = useRef<number>(0);

  const [isOnScreen, setIsOnScreen] = useState(false);
  useEffect(() => {
    if (!IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      const currentY = entry.boundingClientRect.y;
      const currentRatio = entry.intersectionRatio;
      const isIntersecting = entry.isIntersecting;

      if (currentRatio !== 0) {
        // Scrolling down/up
        const _direction: ScrollDirection =
          currentY < previousY.current ? "DOWN" : "UP";
        const direction = currentRatio === 1 ? undefined : _direction;
  
        if (currentRatio > previousRatio.current && isIntersecting) {
          onEnter?.(direction);
        } else {
          onLeave?.(direction);
        }
  
        previousY.current = currentY;
        previousRatio.current = currentRatio;
      };

      setIsOnScreen(isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  return { ref, isOnScreen };
}
