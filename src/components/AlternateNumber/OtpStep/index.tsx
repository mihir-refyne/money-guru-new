import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChatText } from "phosphor-react";
import { OTPInput } from "./OTPInput";
import OtpImage from "@/images/mobile-otp.svg";
import styles from "./styles.module.css";
import useTranslation from "@/hooks/useTranslation";

interface OtpStepProps {
  phoneNumber: string;
  handleSubmit: (otp: string) => Promise<void>;
  handleResend: () => Promise<void>;
}

const OTP_LENGTH = 6;
const INITIAL_TIMER = 45;

export default function OtpStep({
  handleResend,
  handleSubmit,
  phoneNumber,
}: OtpStepProps) {
  const { tWithoutTypeSafety: t } = useTranslation("common");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // Auto-submit when OTP is complete
    if (otp.length === OTP_LENGTH && !isSubmitting) {
      handleOtpSubmit(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(INITIAL_TIMER);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleOtpSubmit(otpValue: string) {
    try {
      setIsSubmitting(true);
      await handleSubmit(otpValue);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onResendClick() {
    setOtp("");
    await handleResend();
    startTimer();
  }

  const formattedPhoneNumber = phoneNumber ? `+91 ${phoneNumber}` : "";

  return (
    <div className={styles.otpStep__container}>
      <Image
        src={OtpImage}
        alt="OTP Verification"
        className={styles.otpStep__image}
        width={120}
        height={120}
      />
      <h2 className={`text-heading text-semibold ${styles.otpStep__heading}`}>
        {t("alternate_number_otp_heading")}
      </h2>
      <p className={`text-body ${styles.otpStep__bodyText}`}>
        {t("alternate_number_otp_sent_to")}{" "}
        <span className={styles.otpStep__phoneNumber}>
          {formattedPhoneNumber}
        </span>
      </p>

      <div className={styles.otpStep__otpWrapper}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          maxLength={OTP_LENGTH}
          autoFocus
        />

        <p className={`text-body ${styles.otpStep__resendText}`}>
          {t("alternate_number_otp_resend_text")}{" "}
          <span className={styles.otpStep__timer}>
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </span>
        </p>

        <div className={styles.otpStep__resendOptions}>
          <button
            className={styles.otpStep__resendButton}
            onClick={onResendClick}
            disabled={timer > 0}
          >
            <ChatText size={16} />
            <span>{t("alternate_number_otp_resend_sms")}</span>
          </button>
        </div>
      </div>

      {/* Hidden submit button for external trigger */}
      <button
        id="otp-submit-btn"
        type="button"
        style={{ display: "none" }}
        onClick={() => handleOtpSubmit(otp)}
        disabled={otp.length !== OTP_LENGTH || isSubmitting}
      />
    </div>
  );
}
