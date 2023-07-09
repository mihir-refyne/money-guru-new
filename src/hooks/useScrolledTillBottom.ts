import { useEffect, useRef } from "react";

interface UseScrolledTillBottomProps {}

export default function useScrolledTillBottom<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  function isElementHasScroll() {
    if (!ref.current) return;
    const hasScroll = ref.current.scrollHeight > ref.current.clientHeight;
    console.log({ hasScroll });
  }

  function handleScrollEvent(e: Event) {
    if (!e.target) return;
    const { scrollHeight, scrollTop, clientHeight } = e.target as HTMLElement;

    if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
      console.log("scrolled");
    }
  }

  useEffect(() => {
    isElementHasScroll();
    ref.current?.addEventListener("scroll", handleScrollEvent);

    return () => {
      ref.current?.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  return { ref };
}
