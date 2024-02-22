interface CreditReportFetchConsentProps {
  onContinueClick?: () => void;
  onNotNowClick?: () => void;
}

export default function CreditReportFetchConsent({
  onContinueClick,
  onNotNowClick,
}: CreditReportFetchConsentProps) {
  return (
    <div>
      <RefreshIconGreen />
      <h3 className="text-heading text-semibold mt-4">Are you sure?</h3>
      <p className="clr-text-secondary mt-4">
        On continuing, you authorise Refyne to fetch your credit score in
        accordance with{" "}
        <span className="clr-text-primary">Refyne’s Terms and Conditions</span>{" "}
        and{" "}
        <span className="clr-text-primary">Equifax User Consent Terms.</span>
      </p>
      <button
        className="btn btn-primary btn-block mt-6"
        onClick={onContinueClick}
      >
        Continue
      </button>
      <button
        className="btn btn-primary-outline btn-block mt-2"
        onClick={onNotNowClick}
      >
        Not now
      </button>
    </div>
  );
}

function RefreshIconGreen() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 8C29.4972 8 34.3498 10.7725 37.2312 15H32V19H42C43.1046 19 44 18.1046 44 17V7H40V11.9987C36.3524 7.14332 30.5448 4 24 4C13.2896 4 4.54552 12.419 4.02456 23.0001C3.9974 23.5518 4.44772 24 5 24H7C7.55228 24 7.99675 23.5511 8.03075 22.9998C8.54704 14.6292 15.4994 8 24 8ZM41 24C40.4477 24 40.0032 24.4489 39.9692 25.0002C39.453 33.3709 32.5007 40 24 40C18.5029 40 13.6502 37.2274 10.7689 33H16V29H6C4.89543 29 4 29.8954 4 31V41H8V36.0012C11.6476 40.8566 17.4553 44 24 44C34.7103 44 43.4545 35.581 43.9754 24.9999C44.0026 24.4482 43.5523 24 43 24H41Z"
        fill="#35924D"
      />
    </svg>
  );
}
