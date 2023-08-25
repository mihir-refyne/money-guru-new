import emptyBoxIllustrationUrl from "@/images/empty-box-illustration.svg";
import Image from "next/image";
import CenterContent from "../CenterContent";
import useTranslation from "@/hooks/useTranslation";

interface NoRecordFoundProps {
  title?: string;
  description?: string;
  transparent?: boolean;
}

export default function NoRecordFound({
  title,
  description,
  transparent = false,
}: NoRecordFoundProps) {
  const { t } = useTranslation("common");
  const backgroundColor = transparent ? "transparent" : "var(--clr-grey-light)";
  const defaultTitle = t("no_record_found_msg");
  return (
    <CenterContent
      illustration={<Image src={emptyBoxIllustrationUrl} alt="No record" />}
      title={title ?? defaultTitle}
      description={description}
      backgroundColor={backgroundColor}
    />
  );
}
