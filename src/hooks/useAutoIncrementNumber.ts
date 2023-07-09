import { useEffect } from "react";
import {
  calculateStepSizeOfAutoIncrement,
  useDelayedStepChangeState,
} from "./useDelayedStepChangeState";

const AUTO_INCREMENT_DELAY_IN_MS = 100;

export function useAutoIncrementNumber(context: {
  active?: boolean;
  durationInMs: number;
  value: number;
  onFinish?: () => void;
}): number {
  const { active = true, value, durationInMs } = context;
  const autoIncrementStepSize = calculateStepSizeOfAutoIncrement(
    value,
    AUTO_INCREMENT_DELAY_IN_MS,
    durationInMs
  );
  const [_value, setValue] = useDelayedStepChangeState(
    100,
    autoIncrementStepSize,
    0
  );

  useEffect(() => {
    setValue(value);
  }, [value]);

  const finalValue = active ? _value : value;
  return finalValue;
}
