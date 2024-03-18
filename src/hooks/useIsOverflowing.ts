import { DependencyList, RefObject, useEffect, useRef, useState } from "react";

interface UseIsOverflowingReturn<T> {
  ref: RefObject<T>;
  isOverflowing: boolean | null;
}

// TODO: Use ResizeObserver later instead of dependencies
export function useIsOverflowing<T extends HTMLElement>(context: {
  dependencies: DependencyList;
}): UseIsOverflowingReturn<T> {
  const { dependencies = [] } = context;
  const elementRef = useRef<T>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean | null>(null);

  useEffect(() => {
    const elem = elementRef.current;
    if (!elem) return;
    // INFO: Need this timeout to get the actuall height
    const timeoutId = setTimeout(() => {
      const { clientWidth, clientHeight, scrollWidth, scrollHeight } = elem;

      const isOverflowing =
        clientWidth < scrollWidth || clientHeight < scrollHeight;

      setIsOverflowing(isOverflowing);
    }, 5);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [elementRef, ...dependencies]);

  return { ref: elementRef, isOverflowing };
}
