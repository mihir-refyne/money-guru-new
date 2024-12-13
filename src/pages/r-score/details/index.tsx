import CreditScoreMeter from "@/components/CreditReport/CreditScoreMeter";
import Tag from "@/components/Tag";
import { useDelayedStepChangeState } from "@/hooks/useDelayedStepChangeState";
import format from "date-fns/format";
import { ArrowUpRight } from "phosphor-react";
import { useEffect } from "react";
import { ImproveRScoreSteps, RScoreBenefits } from "..";
import styles from "./styles.module.css";

interface DetailsProps {
  improveRScoreSteps: ImproveRScoreSteps[];
  rScoreBenefits: RScoreBenefits[];
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
}: DetailsProps) {
  const creditScore = 811;
  const [scoreToBeDisplayed, setScore] = useDelayedStepChangeState(50, 5, 300);

  useEffect(() => {
    setScore(creditScore);
  }, [creditScore]);

  return (
    <>
      <div className={styles.R_Score__CreditScoreMeter__Container}>
        <CreditScoreMeter
          value={scoreToBeDisplayed}
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
            <h2 className="text-title text-semibold mb-2">
              {scoreToBeDisplayed}
            </h2>
            <Tag type="success" className={styles.R_Score__Tag}>
              Excellent
            </Tag>
          </div>
        </CreditScoreMeter>

        <div style={{ marginTop: "-20px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "400",
              color: "#696D70",
              margin: "16px 0",
              textAlign: "center",
            }}
          >
            Next update in 30 days
          </p>
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
              <ArrowUpRight size={14} color="#01752F" />
            </span>
            <p
              style={{ color: "var(--clr-text-primary)", marginLeft: "4px" }}
              className={styles.Caption}
            >
              Up 150 points since last month
            </p>
          </div>
        </div>
      </div>

      <div className={styles.Refyne__Score__Container}>
        <h4
          style={{ width: "75%" }}
          className={`${styles.Heading__Small} text-left mb-2 `}
        >
          Refyne Score: Your Gateway to Financial Freedom
        </h4>
        <p className={`${styles.Caption} text-left mt-1`}>
          Refyne Score is a simple way to build creditworthiness through your
          career growth and use of Refyne products.
        </p>

        {/* How to Improve R-Score */}
        <div className={styles.R__Score__Container}>
          <h4 className={`${styles.Heading__Small} text-left`}>
            How to Improve your R-Score
          </h4>
          <div className={styles.R__Score__Improve__Steps__Container}>
            <ImproveRScore improveRScoreSteps={improveRScoreSteps} />
          </div>
        </div>
      </div>

      <div
        className={styles.R_Score__Benefits__Container}
        style={{ marginBottom: "40px" }}
      >
        <h4 className={`${styles.Heading__Small} text-left`}>
          Unlock Benefits
        </h4>
        <p className={`${styles.Caption} text-left`}>
          Unlock Benefits By Improving Your Score
        </p>

        <div style={{ marginTop: "16px" }}>
          <RScoreBenefitsComp rScoreBenefits={rScoreBenefits} />
        </div>
      </div>
    </>
  );
}

function RScoreBenefitsComp({ rScoreBenefits }: RScoreBenefitsCompProps) {
  return (
    <div
      style={{
        marginBottom: "12px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {rScoreBenefits.map(({ label, icon }) => {
        return (
          <div style={{ marginBottom: "12px" }} key={label}>
            <div className={styles.R_Score__Benefits__Label}>
              <span style={{ marginRight: "8px", marginTop: "5px" }}>
                {icon}
              </span>
              <p className={styles.Body__Text}>{label}</p>
            </div>
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
