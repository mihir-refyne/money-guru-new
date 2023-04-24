import { useEffect, useRef, useState } from "react";

export default function useSyntheticLoader(
  initialState: boolean = false,
  delayInMs: number
) {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, _setIsLoading] = useState(initialState);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  function setIsLoading(nextState: boolean) {
    _setIsLoading(nextState);
    timeoutId.current = setTimeout(() => {
      _setIsLoading(!nextState);
    }, delayInMs);
  }
  return { isLoading, setIsLoading };
}
