import { useEffect, useState } from "react";
import AlternateNumberPage from "@/components/AlternateNumber";
import { sendOtpForCreditReport } from "@/lib/credit-report";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function AlternateNumber() {
  const router = useRouter();
  const [otpRequestId, setOtpRequestId] = useState("");
  const [challengeData, setChallengeData] = useState<{
    requestId: string | null;
    requestContext: {
      challengeConfigGuid: string;
      questionKey: string;
      answerKey: string;
    };
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
    if (!challengeData?.requestId || !challengeData?.requestContext) {
      toast.error("Missing challenge data");
      throw new Error("Missing challenge data");
    }

    const response = await sendOtpForCreditReport(
      "CIBIL",
      challengeData.requestId,
      phoneNumber,
      challengeData.requestContext
    );
    
    if (response && response.success) {
      setOtpRequestId(challengeData.requestId);
      return { requestId: challengeData.requestId };
    }
    throw new Error(response?.message || "Failed to send OTP");
  }

  async function handleVerifyOtp(requestId: string, otp: number) {
    // TODO: Implement OTP verification endpoint when available
    // For now, just simulate success
    console.log("Verifying OTP:", { requestId, otp });
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
