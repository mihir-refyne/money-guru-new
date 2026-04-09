export enum Step {
  Info,
  Otp,
  Success,
}

export const stepCount = Object.keys(Step).filter((key) =>
  isNaN(Number(key))
).length;

export const phoneRegex = /^\d{10}$/;

export const ctaStepToTextMap: Record<Step, string> = {
  [Step.Info]: "Send OTP",
  [Step.Otp]: "Verify",
  [Step.Success]: "Done",
};

export function isPhoneNumber(phoneNumber: string): boolean {
  if (!phoneRegex.test(phoneNumber)) {
    return false;
  }
  return true;
}
