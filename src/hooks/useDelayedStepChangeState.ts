import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export function useDelayedStepChangeState(
  delayInMs: number,
  step: number = 10,
  initialState: number = 0
): [number, Dispatch<SetStateAction<number>>] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tempState, setTempState] = useState<number>(initialState);
  const [delayedState, setDelayedState] = useState<number>(initialState);

  function updateStateWithDelay(delayInMs: number, to: number, step: number) {
    timeoutRef.current = setTimeout(() => {
      setDelayedState((prevValue) => {
        if (prevValue >= to) return prevValue;
        const updatedValue = prevValue + step;
        if (updatedValue > to) return to;
        updateStateWithDelay(delayInMs, to, step);
        return updatedValue;
      });
    }, delayInMs);
  }

  useEffect(() => {
    updateStateWithDelay(delayInMs, tempState, step);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tempState]);

  return [delayedState, setTempState];
}

export function calculateStepSizeOfAutoIncrement(
  value: number,
  delayInMs: number,
  durationInMs?: number
): number {
  if (!durationInMs) return value;
  const steps = durationInMs / delayInMs;
  return Math.floor(value / steps);
}
