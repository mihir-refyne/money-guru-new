import useTranslation from "@/hooks/useTranslation";

interface CreditScoreDifferenceTextProps {
  className?: string;
  children: number;
}

export default function CreditScoreDifferenceText({
  className = "",
  children,
}: CreditScoreDifferenceTextProps) {
  const { t } = useTranslation("common");

  const type = getScoreDifferenceType(children);
  const absoluteDiff = Math.abs(children);
  if (type === "neutral")
    return (
      <p className={`text-center ${className}`}>
        {t("credit_score_not_changed")}
      </p>
    );
  const text = t(
    type === "increment"
      ? "credit_score_increased_by_points"
      : "credit_score_decreased_by_points",
    { difference: absoluteDiff }
  );
  const TrendIcon = type === "increment" ? UpTrendIcon : DownTrendIcon;
  return (
    <p
      className={`flex-center ${className}`}
      style={{ gap: "var(--spacing-2)" }}
    >
      <TrendIcon />
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </p>
  );
}

type DifferenceType = "neutral" | "increment" | "decrement";

function getScoreDifferenceType(difference: number): DifferenceType {
  if (difference > 0) return "increment";
  if (difference < 0) return "decrement";
  return "neutral";
}

const DifferenceTypeToBackgroundColorMap: Record<DifferenceType, string> = {
  neutral: "var(--clr-grey-light)",
  increment: "var(--clr-info-success-light)",
  decrement: "#FDEECA",
};

export function getFooterBackgroundColorByScoreDifference(
  difference: number
): string {
  const type = getScoreDifferenceType(difference);
  return DifferenceTypeToBackgroundColorMap[type];
}

function UpTrendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1688_7349)">
        <mask
          id="mask0_1688_7349"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="-1"
          y="0"
          width="17"
          height="16"
        >
          <path d="M-0.000976562 16H15.999V0H-0.000976562V16Z" fill="white" />
        </mask>
        <g mask="url(#mask0_1688_7349)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.194285 12.4727C0.454635 12.7331 0.876744 12.7331 1.1371 12.4727L5.66569 7.9441L8.52762 10.806C8.78796 11.0664 9.21009 11.0664 9.47042 10.806L15.8038 4.4727C16.0641 4.21237 16.0641 3.79023 15.8038 3.5299C15.5434 3.26957 15.1213 3.26957 14.861 3.5299L8.99902 9.39183L6.1371 6.5299C5.87674 6.26957 5.45464 6.26957 5.19428 6.5299L0.194285 11.5299C-0.0660639 11.7902 -0.0660639 12.2124 0.194285 12.4727Z"
            fill="#2C9E82"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.3332 8.66797C15.7014 8.66797 15.9998 8.3695 15.9998 8.0013V4.0013C15.9998 3.6331 15.7014 3.33464 15.3332 3.33464H11.3332C10.965 3.33464 10.6665 3.6331 10.6665 4.0013C10.6665 4.3695 10.965 4.66797 11.3332 4.66797H14.6665V8.0013C14.6665 8.3695 14.965 8.66797 15.3332 8.66797Z"
            fill="#2C9E82"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1688_7349">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="matrix(1 0 0 -1 0 16)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function DownTrendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1697_8974)">
        <mask
          id="mask0_1697_8974"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="17"
          height="17"
        >
          <path
            d="M0.000976562 0.00390625H16.001V16.0039H0.000976562V0.00390625Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_1697_8974)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.196239 3.52729C0.456588 3.26694 0.878697 3.26694 1.13905 3.52729L5.66764 8.0559L8.52958 5.19396C8.78991 4.93361 9.21204 4.93361 9.47238 5.19396L15.8057 11.5273C16.066 11.7876 16.066 12.2098 15.8057 12.4701C15.5454 12.7304 15.1232 12.7304 14.8629 12.4701L9.00098 6.60817L6.13905 9.4701C5.8787 9.73043 5.45659 9.73043 5.19624 9.4701L0.196239 4.4701C-0.0641108 4.20975 -0.0641108 3.78764 0.196239 3.52729Z"
            fill="#EC9527"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.3327 7.33203C15.7009 7.33203 15.9993 7.6305 15.9993 7.9987V11.9987C15.9993 12.3669 15.7009 12.6654 15.3327 12.6654H11.3327C10.9645 12.6654 10.666 12.3669 10.666 11.9987C10.666 11.6305 10.9645 11.332 11.3327 11.332H14.666V7.9987C14.666 7.6305 14.9645 7.33203 15.3327 7.33203Z"
            fill="#EC9527"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1697_8974">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
