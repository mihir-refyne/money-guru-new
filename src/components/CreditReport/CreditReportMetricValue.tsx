import { Info } from "phosphor-react";
import Tag, { TagType } from "../Tag";

interface CreditReportMetricValueProps {
  title: string;
  text: string;
  subText?: string;
  infoTag?: {
    type: TagType;
    value: string;
  };
  onInfoTagClick?: () => void;
}

export default function CreditReportMetricValue({
  title,
  text,
  subText,
  infoTag,
  onInfoTagClick,
}: CreditReportMetricValueProps) {
  return (
    <div className="my-6">
      <h5 className="text-caption text-medium clr-text-secondary">{title}</h5>
      <h3 className="text-heading text-regular mt-2">
        <span>{text}</span>
        {subText && <span className="text-caption ml-2">({subText})</span>}
      </h3>
      {infoTag && (
        <div className="mt-2">
          <Tag
            type={infoTag.type}
            rightIcon={<Info size={16} />}
            onClick={onInfoTagClick}
          >
            {infoTag.value}
          </Tag>
        </div>
      )}
    </div>
  );
}
