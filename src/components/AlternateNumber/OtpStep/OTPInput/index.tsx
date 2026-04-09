import {
  OTPInput as LibOTPInput,
  REGEXP_ONLY_DIGITS,
  RenderProps,
} from "input-otp";
import { ComponentProps, useCallback } from "react";
import styles from "./styles.module.css";

export function OTPInput(
  props: Omit<
    ComponentProps<typeof LibOTPInput>,
    "render" | "children" | "containerClassName" | "pattern"
  > & {
    hasError?: boolean;
  }
) {
  const slotRenderer = useCallback(
    ({ slots, isHovering }: RenderProps) => {
      const isAnySlotActive = slots.some((slot) => slot.isActive);
      return (
        <>
          <div className={styles.slotContainer}>
            {slots.map((slot, index) => {
              return (
                <div
                  key={index}
                  data-disabled={props.disabled}
                  data-error={props.hasError}
                  data-active={
                    (slot.char && isAnySlotActive) || slot.isActive
                      ? true
                      : false
                  }
                  data-hover={isHovering}
                  className={styles.block}
                >
                  <span
                    className={`text-heading text-semibold ${styles.text}`}
                    data-error={props.hasError}
                    data-disabled={props.disabled}
                  >
                    {slot.char ?? ""}
                  </span>
                  {slot.hasFakeCaret && <div className={styles.caret}></div>}
                </div>
              );
            })}
          </div>
        </>
      );
    },
    [props.disabled, props.hasError]
  );

  return (
    <LibOTPInput
      containerClassName={styles.container}
      pattern={REGEXP_ONLY_DIGITS}
      render={slotRenderer}
      className={styles.rootInput}
      {...props}
    />
  );
}
