import { FormEvent, useId, useState } from "react";
import EpfTrackerLayout from "./EpfTrackerLayout";
import mobileOtpSvg from "@/images/mobile-otp.svg";
import Image from "next/image";
import { PencilSimple } from "phosphor-react";
import EpfTrackerFetchFooter from "./EpfTrackerFetchFooter";
import SeparatedInput from "../SeparatedInput";
import { isValueIsNumeric } from "@/lib/utils";
import useCountdown from "@/hooks/useCountdown";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import EpfTrackerLoading from "./EpfTrackerLoading";

const NO_OF_DIGITS_FOR_OTP = 6;
const CAN_RESEND_AFTER_IN_SEC = 45;

function isEnteredOtpValid(otp: string): boolean {
  return otp.length === NO_OF_DIGITS_FOR_OTP;
}

interface EpfDetailsFetchVerifyProps {
  requestId: string;
  message?: string;
  onEditClick?: () => void;
  onResendClick?: () => void;
  onSubmit: (payload: { requestId: string; otp: string }) => void;
  loading?: boolean;
}

export default function EpfDetailsFetchVerify({
  loading,
  requestId,
  message,
  onEditClick,
  onResendClick,
  onSubmit,
}: EpfDetailsFetchVerifyProps) {
  const formId = useId();

  const [otpValue, setOtpValue] = useState<string>("");

  const { remainingCount, start } = useCountdown({
    countForInSec: CAN_RESEND_AFTER_IN_SEC,
  });

  useUpdateEffect(() => {
    start();
  }, [requestId]);

  function handleOtpChange(value: string) {
    if (!isValueIsNumeric(value)) return;
    setOtpValue(value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ requestId: requestId, otp: otpValue });
  }

  function handleResendClick() {
    setOtpValue("");
    onResendClick?.();
  }

  const isOtpCompletelyEntered = isEnteredOtpValid(otpValue);

  if (loading) return <EpfTrackerLoading />;

  const formattedRemainingSecCount = `00:${remainingCount
    .toString()
    .padStart(2, "0")}`;

  // TODO: Refactor JSX
  return (
    <EpfTrackerLayout
      footer={
        <EpfTrackerFetchFooter
          formId={formId}
          buttonDisabled={!isOtpCompletelyEntered}
        />
      }
    >
      <form
        id={formId}
        className="container flex-center"
        onSubmit={handleSubmit}
      >
        <Image src={mobileOtpSvg} alt="mobile-img" />
        <h4 className="text-heading my-4">Enter OTP</h4>
        <div className="flex-center my-2">
          <h4 className="text-medium text-center clr-text-secondary mr-2">
            {message}
          </h4>
          <button
            type="button"
            className="flex-center"
            style={{
              padding: "var(--spacing-1)",
              backgroundColor: "var(--clr-brand-light)",
              borderRadius: "6px",
            }}
            onClick={onEditClick}
          >
            <PencilSimple
              size={16}
              weight="fill"
              color="var(--clr-brand-default)"
            />
          </button>
        </div>
        <div className="mt-2">
          <SeparatedInput
            numberOfInputs={NO_OF_DIGITS_FOR_OTP}
            value={otpValue}
            onChange={handleOtpChange}
            autoFocus
            acceptOnlyNumber
          />
        </div>
        <div className="mt-4">
          {remainingCount > 0 ? (
            <h4 className="text-body text-regular clr-text-secondary">
              Resend OTP in
              <span className="clr-brand-default ml-2">
                {formattedRemainingSecCount}
              </span>
            </h4>
          ) : (
            <button
              type="button"
              className="btn btn-text"
              onClick={handleResendClick}
            >
              Resend Now
            </button>
          )}
        </div>
      </form>
    </EpfTrackerLayout>
  );
}
