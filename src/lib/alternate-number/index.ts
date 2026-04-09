import { getValueFromMetadata } from "../core/user-metadata";
import { fetcher } from "../fetcher";

const CORE_SERVER_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVER_BASE_URL;

export interface SendAlternateNumberOtpResponse {
  requestId: string;
}

export async function sendAlternateNumberOtp(
  phoneNumber: string
): Promise<SendAlternateNumberOtpResponse | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<SendAlternateNumberOtpResponse>(
    `${CORE_SERVER_BASE_URL}/user/alternative-identifiers/phone-number/send-otp`,
    {
      method: "POST",
      payload: { phoneNumber },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function verifyAlternateNumberOtp(
  requestId: string,
  otp: number
): Promise<void> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return;
  await fetcher(
    `${CORE_SERVER_BASE_URL}/user/alternative-identifiers/phone-number/verify-otp`,
    {
      method: "POST",
      payload: { requestId, otp },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
}
