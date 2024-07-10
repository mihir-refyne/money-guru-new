import Link from "next/link";
import Card from "../Card";
import {
  HowToWithdrawPfSummaryType,
  PermittedClaimReasonType,
  SummaryStep,
} from "./constants";
import EpfTrackerLayout from "./EpfTrackerLayout";
import useTranslation from "@/hooks/useTranslation";

interface EpfHowToWithdrawalSummaryCardProps {
  summary?: HowToWithdrawPfSummaryType[];
  reason?: PermittedClaimReasonType[];
}

interface EpfStepProps {
  heading: string;
  summarySteps: SummaryStep[];
}

export default function EpfHowToWithdrawalSummaryCard({
  summary,
  reason,
}: EpfHowToWithdrawalSummaryCardProps) {
  const arrayToMap = summary ?? reason;
  return (
    <EpfTrackerLayout>
      {arrayToMap?.map(({ heading, summarySteps }) => (
        <EpfStep key={heading} heading={heading} summarySteps={summarySteps} />
      ))}
    </EpfTrackerLayout>
  );
}

function EpfStep({ heading, summarySteps }: EpfStepProps) {
  const { tWithoutTypeSafety } = useTranslation();
  return (
    <div key={heading} style={{ marginBottom: "24px" }}>
      <h4
        style={{ marginBottom: "12px" }}
        className="text-body clr-text-secondary"
      >
        {tWithoutTypeSafety(heading)}
      </h4>
      <Card
        backgroundColor="##FFFFFF"
        border="1px solid #F0F0F0"
        boxShadow="1px 0px 10px 1px #1212120A"
      >
        {summarySteps.map((step, idx) => {
          const {
            icon,
            imgURL,
            desc,
            hasDescFooter,
            descFooterIcon,
            descFooterText,
            label,
            hasBottomBorder,
            iconBackgroundColor,
          } = step;
          return (
            <div key={label}>
              <div style={{ display: "flex" }}>
                <div>
                  <div
                    style={{
                      background: iconBackgroundColor ?? "#EFF6FF",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "8px",
                    }}
                  >
                    {imgURL ? (
                      <img src={imgURL} />
                    ) : (
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          margin: 0,
                        }}
                      >
                        {icon ? icon : idx + 1}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {label && (
                    <h4
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        marginBottom: "4px",
                      }}
                    >
                      {tWithoutTypeSafety(label)}
                    </h4>
                  )}
                  {desc && (
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "400",
                      }}
                      className="clr-text-secondary"
                    >
                      {tWithoutTypeSafety(desc)}
                    </p>
                  )}

                  {hasDescFooter && (
                    <Link
                      href="/epf-tracker/epf-permitted-claim-reason"
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          marginTop: "8px",
                          alignItems: "center",
                        }}
                      >
                        {descFooterText && (
                          <p
                            style={{
                              color: "#0057B7",
                              fontWeight: "600",
                              margin: "0",
                              lineHeight: "1",
                            }}
                          >
                            {tWithoutTypeSafety(descFooterText)}
                          </p>
                        )}

                        <span
                          style={{
                            marginLeft: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {descFooterIcon}
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
              {hasBottomBorder && (
                <hr
                  style={{
                    border: "1px solid #F0F0F0",
                    margin: "16px",
                  }}
                />
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}
