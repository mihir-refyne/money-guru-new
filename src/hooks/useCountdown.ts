import { useEffect, useRef, useState } from "react";

interface UseCountdownReturn {
  remainingCount: number;
  start: () => void;
  stop: () => void;
}

interface UseCountdownProps {
  countForInSec: number;
  countDownUntilInSec?: number;
  decreaseBy?: number;
  intervalInSec?: number;
  onExpiry?: () => void;
}

export default function useCountdown({
  countForInSec,
  countDownUntilInSec = 0,
  decreaseBy = 1,
  intervalInSec = 1,
  onExpiry,
}: UseCountdownProps): UseCountdownReturn {
  const [remainingCount, setRemainingCount] = useState<number>(countForInSec);
  const intervalId = useRef<number>();

  function start() {
    setRemainingCount(countForInSec);
    intervalId.current = window.setInterval(() => {
      setRemainingCount((prevCount) => prevCount - decreaseBy);
    }, intervalInSec * 1000);
  }

  function stop(expired: boolean = false) {
    window.clearInterval(intervalId.current);
    if (expired && onExpiry) onExpiry();
  }

  useEffect(() => {
    intervalId.current = window.setInterval(() => {
      setRemainingCount((prevCount) => prevCount - decreaseBy);
    }, intervalInSec * 1000);

    return stop;
  }, [intervalInSec, decreaseBy]);

  useEffect(() => {
    if (remainingCount <= countDownUntilInSec) stop(true);
  }, [remainingCount]);

  return { remainingCount, start, stop };
}
