import Link from "next/link";
import Card from "../Card";
import {
  HowToWithdrawPfSummaryType,
  PermittedClaimReasonType,
  SummaryStep,
} from "./constants";
import EpfTrackerLayout from "./EpfTrackerLayout";

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
  return (
    <div key={heading} style={{ marginBottom: "24px" }}>
      <h4
        style={{ marginBottom: "12px" }}
        className="text-body clr-text-secondary"
      >
        {heading}
      </h4>
      <Card
        backgroundColor="##FFFFFF"
        border="1px solid #F0F0F0"
        boxShadow="1px 0px 10px 1px #1212120A"
      >
        {summarySteps.map((step, idx) => {
          const {
            icon,
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
                    <p
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {icon ? icon : idx + 1}
                    </p>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    {label}
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                    className="clr-text-secondary"
                  >
                    {desc}
                  </p>
                  {hasDescFooter && (
                    <Link
                      href="/epf-tracker/epf-permitted-claim-reason"
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          marginTop: "8px",
                        }}
                      >
                        <p
                          style={{
                            color: "#0057B7",
                            fontWeight: "600",
                            fontSize: "14px",
                          }}
                        >
                          {descFooterText}
                        </p>
                        <span>{descFooterIcon}</span>
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
