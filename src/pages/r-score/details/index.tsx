import CreditScoreMeter from "@/components/CreditReport/CreditScoreMeter";
import format from "date-fns/format";
import Link from "next/link";
import { CaretDown, CaretRight, Info, Lock } from "phosphor-react";
import { useState } from "react";
import { FinancialPillar, ImproveRScoreSteps, RScoreBenefits } from "..";
import styles from "./styles.module.css";

interface DetailsProps {
  improveRScoreSteps: ImproveRScoreSteps[];
  rScoreBenefits: RScoreBenefits[];
  financialPillars: FinancialPillar[];
}

interface ImproveRScoreProps {
  improveRScoreSteps: ImproveRScoreSteps[];
}

interface RScoreBenefitsCompProps {
  rScoreBenefits: RScoreBenefits[];
}

export default function Details({
  improveRScoreSteps,
  rScoreBenefits,
  financialPillars,
}: DetailsProps) {
  const [expandedPillarIndex, setExpandedPillarIndex] = useState<number | null>(
    null
  );

  return (
    <>
      <div className={styles.R_Score__CreditScoreMeter__Container}>
        <CreditScoreMeter
          value={811}
          min={300}
          max={900}
          width={300}
          indicatorColors={[
            {
              from: 300,
              to: 601,
              color: "#F57B7B",
            },
            {
              from: 602,
              to: 705,
              color: "#8A5006",
            },
            {
              from: 706,
              to: 730,
              color: "#EC9527",
            },
            {
              from: 731,
              to: 750,
              color: "#2C9E82",
            },
            {
              from: 751,
              to: 900,
              color: "#0C7057",
            },
          ]}
        >
          <div className="text-center">
            <p className="text-caption clr-text-secondary mb-2">
              {format(new Date(), "MMM yyyy")}
            </p>

            <Lock size={49} weight="fill" />
          </div>
        </CreditScoreMeter>

        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #01752F",
              borderRadius: "4px",
              padding: "4px 8px",
              marginBottom: "20px",
            }}
          >
            <span style={{ marginTop: "4px" }}>
              <Info size={16} />
            </span>
            <p
              style={{ color: "var(--clr-text-primary)", marginLeft: "4px" }}
              className={styles.Caption}
            >
              Use the app for a month to track your score.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.Refyne__Score__Container}>
        <h4
          style={{ width: "75%" }}
          className={`${styles.Heading__Small} text-left mb-2 `}
        >
          Refyne Score <br /> Your Gateway to Financial Freedom
        </h4>
        <p className={`${styles.Caption} text-left mt-1`}>
          Your financial health score that opens doors to better credit limits,
          lower interest rates, and exclusive financial products. The higher
          your score, the better your benefits.
        </p>

        {/* How to Improve R-Score */}
        <div className={styles.R__Score__Container}>
          <h4 className={`${styles.Heading__Small} text-left`}>
            Simple Steps To Boost Your Score
          </h4>
          <div className={styles.R__Score__Improve__Steps__Container}>
            <ImproveRScore improveRScoreSteps={improveRScoreSteps} />
          </div>
        </div>
      </div>

      <div
        className={styles.R_Score__Benefits__Container}
        style={{ marginBottom: "20px" }}
      >
        <h4 className={`${styles.Heading__Small} text-left`}>
          Unlock Benefits
        </h4>

        <div style={{ margin: "16px 0" }}>
          <RScoreBenefitsComp rScoreBenefits={rScoreBenefits} />
        </div>
      </div>

      {/* Financial Pillars */}
      <div id="components" className={styles.Financial__Pillars__Container}>
        <h4 className={styles.section_title}>Your Financial Wellness Areas</h4>

        {financialPillars.map((pillar, index) => (
          <div
            key={pillar.name}
            className={`${styles.Pillar__Card} ${
              expandedPillarIndex === index ? styles.expanded : ""
            }`}
            onClick={() => {
              setExpandedPillarIndex(
                expandedPillarIndex === index ? null : index
              );
            }}
          >
            <div className={styles.Pillar__Header}>
              <div className={styles.Pillar__Header_Content}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className={styles.priority_indicator}>{index + 1}</div>
                </div>
                <div>
                  <h5 className={styles.Pillar__Title}>{pillar.name}</h5>
                  <p className={styles.pillar_description}>
                    {pillar.description}
                  </p>
                </div>
              </div>
              <CaretDown
                size={24}
                className={`${styles.expand_icon} ${
                  expandedPillarIndex === index ? styles.expanded : ""
                }`}
              />
            </div>

            {expandedPillarIndex === index && (
              <div className={styles.Pillar__Content}>
                <div className={styles.why_matters}>
                  <h6 className={styles.Content__Title}>Why it matters</h6>
                  <ul className={styles.Benefits__List}>
                    {pillar.whyItMatters.map((benefit, idx) => (
                      <li key={idx} className={styles.Benefit__Item}>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.improvements}>
                  <h6 className={styles.Content__Title}>Recommended Actions</h6>
                  <div className={styles.Improvements__List}>
                    {pillar.improvements.map((improvement, idx) => (
                      <ActionLink
                        key={idx}
                        href={improvement.redirectionPath}
                        action={improvement.action}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function ActionLink({
  href,
  action,
  idx,
  className,
}: {
  href: string;
  action: string;
  idx?: number;
  className?: string;
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
  }

  return (
    <Link
      href={href}
      key={idx}
      className={`${styles.action_button} ${className || ""}`}
      onClick={handleClick}
    >
      <div className={styles.action_content}>
        <div className={styles.Improvement__Action}>{action}</div>
        <CaretRight size={20} weight="bold" color="#121212" />
      </div>
    </Link>
  );
}

function RScoreBenefitsComp({ rScoreBenefits }: RScoreBenefitsCompProps) {
  return (
    <div
      style={{
        border: "1px solid var(--clr-border-enabled)",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      {rScoreBenefits.map(({ label, icon }) => {
        return (
          <div key={label} className={styles.R_Score__Benefits__Label}>
            <span style={{ marginRight: "8px", marginTop: "5px" }}>{icon}</span>
            <p className={styles.Body__Text}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}

function ImproveRScore({ improveRScoreSteps }: ImproveRScoreProps) {
  return (
    <>
      {improveRScoreSteps.map(({ step, description, heading }) => {
        const isLastItem = step === improveRScoreSteps.length;

        return (
          <div key={step}>
            <div className={styles.R_Score__Steps}>
              <div className={styles.R_Score__Step__Number}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#0057B7",
                  }}
                >
                  {step}
                </h3>
              </div>
              <div className={styles.R_Score__Steps__Desc}>
                <p
                  style={{ marginBottom: "4px" }}
                  className={`${styles.Body__Text} text-left`}
                >
                  {heading}
                </p>
                <p className={`${styles.Caption} text-left`}>{description}</p>
              </div>
            </div>
            {!isLastItem && (
              <hr
                style={{
                  all: "unset",
                  display: "block",
                  height: "1px",
                  background: "#F0F0F0",
                  margin: "20px 0",
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
