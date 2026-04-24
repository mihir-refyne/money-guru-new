import { useEffect, useState } from "react";
import AlternateNumberPage from "@/components/AlternateNumber";
import {
  sendOtpForCreditReport,
  verifyOtpForCreditReport,
  CreditBureauVendor,
} from "@/lib/credit-report";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function AlternateNumber() {
  const router = useRouter();
  const [otpRequestId, setOtpRequestId] = useState("");
  const [challengeData, setChallengeData] = useState<{
    vendor: CreditBureauVendor;
    requestId: string | null;
    requestContext: {
      challengeConfigGuid: string;
      questionKey: string;
      answerKey: string;
    };
  } | null>(null);
  const [verifyOtpContext, setVerifyOtpContext] = useState<{
    challengeConfigGuid: string;
    questionKey: string;
    answerKey: string;
  } | null>(null);

  useEffect(() => {
    // Retrieve challenge data from sessionStorage
    const storedData = sessionStorage.getItem("__CreditBureauChallenge");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setChallengeData(parsed);
      } catch (error) {
        console.error("Failed to parse challenge data:", error);
        toast.error("Invalid challenge data");
        router.replace("/credit-report");
      }
    } else {
      // If no challenge data, redirect back to credit report
      router.replace("/credit-report");
    }
  }, [router]);

  async function handleSendOtp(phoneNumber: string) {
    if (
      !challengeData?.requestId ||
      !challengeData?.requestContext ||
      !challengeData?.vendor
    ) {
      toast.error("Missing challenge data");
      throw new Error("Missing challenge data");
    }

    const response = await sendOtpForCreditReport(
      challengeData.vendor,
      challengeData.requestId,
      phoneNumber,
      challengeData.requestContext
    );

    if (response && response.data.verifyOtpChallenge) {
      // Store the verify OTP context for later use
      setVerifyOtpContext({
        challengeConfigGuid:
          response.data.verifyOtpChallenge.challengeConfigGuid,
        questionKey: response.data.verifyOtpChallenge.questionKey,
        answerKey: response.data.verifyOtpChallenge.answerKey,
      });
      setOtpRequestId(response.data.requestId || "");
      return { requestId: response.data.requestId || "" };
    }
    throw new Error("Failed to send OTP");
  }

  async function handleVerifyOtp(requestId: string, otp: number) {
    if (!verifyOtpContext || !challengeData?.vendor) {
      toast.error("Missing verification context");
      throw new Error("Missing verification context");
    }

    const response = await verifyOtpForCreditReport(
      challengeData.vendor,
      requestId,
      otp.toString(),
      verifyOtpContext
    );

    if (response && response.success) {
      return;
    }
    throw new Error(response?.message || "Failed to verify OTP");
  }

  function handleComplete() {
    // Clear challenge data and redirect to credit report
    sessionStorage.removeItem("__CreditBureauChallenge");
    router.replace("/credit-report/summary");
  }

  if (!challengeData) {
    return null;
  }

  return (
    <AlternateNumberPage
      otpRequestId={otpRequestId}
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtp}
      onComplete={handleComplete}
    />
  );
}
