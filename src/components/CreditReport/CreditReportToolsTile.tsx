import useTranslation from "@/hooks/useTranslation";
import ListCard from "../ListCard";
import { ScreenName } from "@/constants/ScreenName";
import constructElementId from "@/lib/utils/constructElementId";

export interface CreditReportTool {
  name: string;
  title: string;
  description: string;
  iconUrl: string;
  backgroundColor: string;
  url: string;
}

interface CreditReportToolsTileProps {
  tools: Array<CreditReportTool>;
  onClick: (toolName: string, url: string) => void;
}

export default function CreditReportToolsTile({
  tools,
  onClick,
}: CreditReportToolsTileProps) {
  const { tWithoutTypeSafety } = useTranslation("common");

  function handleClick(toolName: string, url: string) {
    return () => onClick(toolName, url);
  }

  return (
    <>
      {tools.map((tool) => {
        const title = tWithoutTypeSafety(tool.title);
        const description = tWithoutTypeSafety(tool.description);
        const elementHtmlId = constructElementId({
          screenName: ScreenName.MONGU_CREDIT_REPORT_DASHBOARD,
          elementName: "TOOLS_TILE",
          elementId: tool.name,
        });
        return (
          <ListCard
            key={tool.name}
            className="my-4"
            background={tool.backgroundColor}
            items={[
              {
                id: elementHtmlId,
                leftIcon: (
                  <img
                    src={tool.iconUrl}
                    alt={title}
                    style={{
                      maxHeight: "var(--spacing-12)",
                      maxWidth: "var(--spacing-12)",
                    }}
                  />
                ),
                contentLeftTitle: title,
                contentLeftDescription: description,
                alignItems: "center",
                hasGapBetweenContentItems: false,
                onClick: handleClick(tool.name, tool.url),
              },
            ]}
          />
        );
      })}
    </>
  );
}
