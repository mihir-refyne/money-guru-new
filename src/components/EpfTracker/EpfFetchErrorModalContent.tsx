import useTranslation from "@/hooks/useTranslation";

export interface EpfFetchErrorModalContentProps {
  illustrationUrl?: string;
  title: string;
  description: string;
  closable: boolean;
  primaryCta?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
  secondaryCta?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
}

function EpfFetchErrorModalContent({
  illustrationUrl,
  title,
  description,
  primaryCta,
  secondaryCta,
}: EpfFetchErrorModalContentProps) {
  const { tWithoutTypeSafety } = useTranslation("common");
  return (
    <div className="text-left">
      {illustrationUrl && (
        <img
          src={illustrationUrl}
          alt={title}
          className="my-4"
          width="100%"
          style={{ height: "4rem", width: "4rem", maxHeight: "6rem" }}
        />
      )}
      <h4 className="text-heading text-semibold mb-3">
        {tWithoutTypeSafety(title)}
      </h4>
      <p className="clr-text-secondary mb-8">
        {tWithoutTypeSafety(description)}
      </p>
      {primaryCta && (
        <button
          className="btn btn-primary btn-block"
          onClick={primaryCta.onClick}
        >
          {tWithoutTypeSafety(primaryCta.label)}
        </button>
      )}
      {secondaryCta && (
        <button
          className="btn btn-text btn-block mt-2"
          onClick={secondaryCta.onClick}
        >
          {tWithoutTypeSafety(secondaryCta.label)}
        </button>
      )}
    </div>
  );
}

export default function EpfFetchErrorModalContentWrapper(props: {
  content: EpfFetchErrorModalContentProps | null;
  onCtaClickFallback?: () => void;
}) {
  if (!props.content) return null;

  const primaryCta = props.content.primaryCta
    ? { onClick: props.onCtaClickFallback, ...props.content.primaryCta }
    : undefined;
  const secondaryCta = props.content.secondaryCta
    ? { onClick: props.onCtaClickFallback, ...props.content.secondaryCta }
    : undefined;

  return (
    <EpfFetchErrorModalContent
      {...props.content}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
    />
  );
}
