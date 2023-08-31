import { CSSProperties, ReactElement } from "react";

interface CenterContentProps {
  illustration?: ReactElement;
  title: string;
  description?: string;
  backgroundColor?: CSSProperties["backgroundColor"];
}

export default function CenterContent({
  illustration,
  title,
  description,
  backgroundColor,
}: CenterContentProps) {
  return (
    <div
      className="flex-center my-4"
      style={{
        flexDirection: "column",
        backgroundColor,
        padding: "var(--spacing-6) var(--spacing-4)",
        borderRadius: "var(--spacing-4)",
      }}
    >
      {illustration}
      <h3 className="text-body text-semibold mt-4">{title}</h3>
      {description && (
        <p className="clr-text-secondary text-center mt-2">{description}</p>
      )}
    </div>
  );
}
