import { useEffect, useRef } from "react";
import type { EffectCallback, DependencyList } from "react";

export default function useUpdateEffect(
  fn: EffectCallback,
  dependencies?: DependencyList
) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return fn();
    } else {
      mounted.current = true;
    }
  }, dependencies);
}
