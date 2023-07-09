import emptyBoxIllustrationUrl from "@/images/empty-box-illustration.svg";
import Image from "next/image";

interface NoRecordFoundProps {
  title?: string;
  description?: string;
  transparent?: boolean;
}

export default function NoRecordFound({
  title = "No record found",
  description,
  transparent = false,
}: NoRecordFoundProps) {
  const backgroundColor = transparent ? "transparent" : "var(--clr-grey-light)";
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
      <Image src={emptyBoxIllustrationUrl} alt="No record" />
      <h3 className="text-body text-semibold mt-4">{title}</h3>
      {description && <p className="clr-text-secondary mt-2">{description}</p>}
    </div>
  );
}
