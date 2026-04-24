"use client";

import CircularSpinner from "@/components/CircularSpinner";
import PageLayout from "@/components/PageLayout";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import InfoStep from "./InfoStep";
import OtpStep from "./OtpStep";
import styles from "./styles.module.css";
import SuccessStep from "./SuccessStep";
import { isPhoneNumber, Step, stepCount } from "./types";
import useTranslation from "@/hooks/useTranslation";

interface AlternateNumberPageProps {
  // Props for API integration later
  otpRequestId?: string;
  isLoading?: boolean;
  onSendOtp?: (phoneNumber: string) => Promise<{ requestId: string }>;
  onVerifyOtp?: (requestId: string, otp: number) => Promise<void>;
  onComplete?: () => void;
}

export default function AlternateNumberPage({
  otpRequestId: propOtpRequestId,
  isLoading: propIsLoading = false,
  onSendOtp,
  onVerifyOtp,
  onComplete,
}: AlternateNumberPageProps) {
  const router = useRouter();
  const { tWithoutTypeSafety: t } = useTranslation("common");
  const [currentStep, setCurrentStep] = useState(Step.Info);
  const [enteredNumber, setEnteredNumber] = useState("");
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [otpRequestId, setOtpRequestId] = useState(propOtpRequestId || "");

  const contentClassName = useMemo(() => {
    const baseClass = styles.alternateNumber__content;
    const alignClass =
      currentStep < Step.Otp
        ? styles.alternateNumber__contentLeftAlign
        : styles.alternateNumber__contentCenterAlign;
    return `${baseClass} ${alignClass}`;
  }, [currentStep]);

  const getCtaText = () => {
    switch (currentStep) {
      case Step.Info:
        return t("alternate_number_cta_send_otp");
      case Step.Otp:
        return t("alternate_number_cta_verify");
      case Step.Success:
        return t("alternate_number_cta_done");
      default:
        return "";
    }
  };

  async function sendOtp() {
    if (onSendOtp) {
      try {
        setIsLoading(true);
        const response = await onSendOtp(enteredNumber);
        if (!response?.requestId) {
          throw new Error("No request id from API");
        }
        setOtpRequestId(response.requestId);
      } catch (error) {
        toast.error(t("alternate_number_error_send_otp_failed"));
        return false;
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error(t("alternate_number_error_no_handler"));
      return false;
    }
    return true;
  }

  async function handlePrimaryClick() {
    if (currentStep === Step.Info) {
      const success = await sendOtp();
      if (success) {
        setCurrentStep(Step.Otp);
      }
      return;
    }

    if (currentStep === Step.Otp) {
      const submitBtn = document.getElementById("otp-submit-btn");
      submitBtn?.click();
      return;
    }

    if (currentStep === Step.Success) {
      if (onComplete) {
        onComplete();
      } else {
        router.back();
      }
      return;
    }

    if (currentStep < stepCount - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  async function handleOtpSubmit(otp: string) {
    if (onVerifyOtp && otpRequestId) {
      try {
        setIsLoading(true);
        await onVerifyOtp(otpRequestId, Number(otp));
      } catch (error) {
        toast.error(t("alternate_number_error_wrong_otp"));
        return;
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error(t("alternate_number_error_no_request_id"));
      return;
    }
    setCurrentStep(Step.Success);
  }

  async function handleResendOtp() {
    await sendOtp();
  }

  const isButtonDisabled = isLoading || !isPhoneNumber(enteredNumber);

  const footer = (
    <div className={styles.alternateNumber__footer}>
      <button
        className="btn btn-primary btn-block"
        disabled={currentStep === Step.Info ? isButtonDisabled : isLoading}
        onClick={handlePrimaryClick}
      >
        {isLoading ? t("alternate_number_cta_loading") : getCtaText()}
      </button>
    </div>
  );

  return (
    <PageLayout
      title={t("alternate_number_page_title")}
      navbarText={t("alternate_number_page_title")}
      pageBackground="var(--clr-pure-white)"
      footer={footer}
      hasContentPadding={currentStep !== Step.Success}
    >
      <div className={contentClassName}>
        {isLoading && currentStep === Step.Info ? (
          <div className={styles.alternateNumber__loader}>
            <CircularSpinner />
          </div>
        ) : (
          <>
            {currentStep === Step.Info && (
              <InfoStep
                setEnteredNumber={setEnteredNumber}
                enteredNumber={enteredNumber}
              />
            )}
            {currentStep === Step.Otp && (
              <OtpStep
                phoneNumber={enteredNumber}
                handleSubmit={handleOtpSubmit}
                handleResend={handleResendOtp}
              />
            )}
            {currentStep === Step.Success && <SuccessStep />}
          </>
        )}
      </div>
    </PageLayout>
  );
}
