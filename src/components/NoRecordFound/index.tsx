import emptyBoxIllustrationUrl from "@/images/empty-box-illustration.svg";
import Image from "next/image";
import CenterContent from "../CenterContent";

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
    <CenterContent
      illustration={<Image src={emptyBoxIllustrationUrl} alt="No record" />}
      title={title}
      description={description}
      backgroundColor={backgroundColor}
    />
  );
}
