interface EpfTrackerFetchFooterProps {
  formId?: string;
  buttonDisabled?: boolean;
  onClick?: () => void;
}

export default function EpfTrackerFetchFooter({
  formId,
  buttonDisabled,
  onClick,
}: EpfTrackerFetchFooterProps) {
  return (
    <>
      <button
        type="submit"
        className="btn btn-primary btn-block"
        form={formId}
        onClick={onClick}
        disabled={buttonDisabled}
      >
        Next
      </button>
      <p className="text-caption clr-text-secondary mt-4">
        By clicking next you agree to the consent to fetch your Provident Fund
        account details.
      </p>
    </>
  );
}
