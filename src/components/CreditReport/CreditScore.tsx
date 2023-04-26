import { useEffect } from "react";
import {
  CreditReportFetchError,
  ScoreValues,
  setCreditScoreIncrementEffectShown,
} from "@/lib/credit-report";
import Image from "next/image";
import cardSearchErrorIconUrl from "@/images/card_search_error.svg";
import creditScoreMeterBlurredUrl from "@/images/credit_score_meter_blurred.png";
import { Info, Lock } from "phosphor-react";
import Tag from "../Tag";
import { getTagTypeByCreditMetricRating } from "./helpers";
import format from "date-fns/format";
import CreditScoreMeter from "./CreditScoreMeter";
import { useDelayedStepChangeState } from "@/hooks/useDelayedStepChangeState";

interface CreditScoreProps {
  score?: ScoreValues;
  error: Error | null;
  fetchedAt?: string;
  autoIncrementEffect?: boolean;
  onTagClick?: () => void;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
}

export default function CreditScore({
  score,
  error,
  fetchedAt,
  autoIncrementEffect,
  onTagClick,
  onCtaClick,
}: CreditScoreProps) {
  const [_score, setScore] = useDelayedStepChangeState(50, 5, 300);
  useEffect(() => {
    if (!score || !autoIncrementEffect) return;
    setScore(Number(score.score));
    setCreditScoreIncrementEffectShown();
  }, [score?.score]);
  if (score) {
    const scoreToBeDisplayed = autoIncrementEffect ? _score : Number(score.score);
    return (
      <>
        <div className="flex-center mb-4">
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
              {fetchedAt && (
                <p className="text-caption clr-text-secondary mb-2">
                  {format(new Date(fetchedAt), "MMMM yyyy")}
                </p>
              )}
              <h2 className="text-title text-semibold mb-2">{scoreToBeDisplayed}</h2>
              <Tag
                type={getTagTypeByCreditMetricRating(score?.rating)}
                rightIcon={<Info size={16} />}
                onClick={onTagClick}
              >
                {score.rating.replaceAll("_", " ").toLowerCase()}
              </Tag>
            </div>
          </CreditScoreMeter>
        </div>
        <p className="text-caption clr-text-secondary text-center">
          Credit report will update next month
        </p>

        <BelowScoreCta kycIncomplete={false} onCtaClick={onCtaClick} />
      </>
    );
  }

  if (error?.name === CreditReportFetchError.USER_IS_IN_VERIFICATION_PENDING) {
    return (
      <>
        <div
          className="flex-center"
          style={{
            flexDirection: "column",
            height: "17.8rem",
            width: "100%",
            background: `no-repeat center url(${creditScoreMeterBlurredUrl.src})`,
          }}
        >
          <Lock size={32} weight="fill" />
          <p className="text-semibold mt-4">Your KYC is in progress...</p>
        </div>
        <BelowScoreCta kycIncomplete={false} onCtaClick={onCtaClick} />
      </>
    );
  }
  if (error?.name === CreditReportFetchError.USER_IS_NOT_KYC_VERIFIED) {
    return (
      <>
        <div
          className="flex-center"
          style={{
            flexDirection: "column",
            height: "17.8rem",
            width: "100%",
            background: `no-repeat center url(${creditScoreMeterBlurredUrl.src})`,
          }}
        >
          <Lock size={32} weight="fill" />
        </div>
        <BelowScoreCta kycIncomplete onCtaClick={onCtaClick} />
      </>
    );
  }
  return (
    <>
      <div
        style={{
          backgroundColor: "var(--clr-grey-light)",
          padding: "var(--spacing-6) var(--spacing-4)",
          borderRadius: "var(--spacing-4)",
        }}
      >
        <Image
          src={cardSearchErrorIconUrl}
          alt="Credit score not available"
        />
        <h2 className="text-heading text-semibold mt-4">
          Credit score not available
        </h2>
        <p className="text-caption clr-text-secondary mt-2">
          We will notify you once it&quot;s available!
        </p>
      </div>
      <BelowScoreCta kycIncomplete={false} onCtaClick={onCtaClick} />
    </>
  );
}

function BelowScoreCta(props: {
  kycIncomplete: boolean;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
}) {
  const APP_BASE_URL =
    process.env.NEXT_PUBLIC_APP_BASE_URL ?? "https://app.refyne.co.in/";

  const text = props.kycIncomplete
    ? "Complete KYC to unlock your Credit Score"
    : "Want to know more about Credit Score?";
  const ctaLabel = props.kycIncomplete
    ? "Complete KYC"
    : "Start Reading R-Shorts";

  function handleCtaClick() {
    const navigateTo = props.kycIncomplete
      ? APP_BASE_URL
      : "/shorts#understanding-credit-score";
    const webviewRoute = props.kycIncomplete ? "dashboard" : undefined;
    props.onCtaClick(navigateTo, webviewRoute);
  }

  return (
    <div className="px-4 mt-4">
      <p className="text-medium text-center mb-3">{text}</p>
      <button className="btn btn-block btn-primary" onClick={handleCtaClick}>
        {ctaLabel}
      </button>
    </div>
  );
}
