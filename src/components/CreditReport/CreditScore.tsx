import { ReactElement, useEffect } from "react";
import {
  CreditReportFetchError,
  CreditReportMetricRating,
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
import useTranslation from "@/hooks/useTranslation";
import styles from "./CreditScore.module.css";
import Card from "../Card";
import CreditScoreDifferenceText, {
  getFooterBackgroundColorByScoreDifference,
} from "./CreditScoreDifferenceText";
import differenceInDays from "date-fns/differenceInDays";
import constructElementId from "@/lib/utils/constructElementId";
import { ScreenName } from "@/constants/ScreenName";

interface CreditScoreProps {
  score?: ScoreValues;
  scoreDifference: number | null;
  error: Error | null;
  fetchedAt?: string;
  expiresAt?: string;
  autoIncrementEffect?: boolean;
  onTagClick?: () => void;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
}

export default function CreditScore({
  score,
  scoreDifference,
  error,
  fetchedAt,
  expiresAt,
  autoIncrementEffect,
  onTagClick,
  onCtaClick,
}: CreditScoreProps) {
  const { t } = useTranslation("common");

  if (score) {
    const creditSocre = Number(score.score);
    if (creditSocre >= 300) {
      return (
        <CreditScoreMeterWrapper
          fetchedAt={fetchedAt}
          expiresAt={expiresAt}
          onTagClick={onTagClick}
          creditScore={creditSocre}
          creditScoreDifference={scoreDifference}
          creditRating={score.rating}
          autoIncrementEffect={autoIncrementEffect}
          onCtaClick={onCtaClick}
        />
      );
    }
    if (creditSocre > 0 && creditSocre <= 6) {
      const monthsRemainingToGetCreditScore = 7 - creditSocre;
      return (
        <CreditScoreHero
          cardContent={
            <BelowScoreCta
              kycIncomplete={false}
              reportAvailable={false}
              onCtaClick={onCtaClick}
            />
          }
        >
          <div className="text-center">
            <Image
              src={cardSearchErrorIconUrl}
              alt="Credit score not available yet"
            />
            <h2 className="text-heading text-semibold mt-4">
              {t("credit_score_unavailable")}
            </h2>
            <p className="text-caption clr-text-secondary mt-2">
              {t("credit_score_new_user", { monthsRemainingToGetCreditScore })}
            </p>
          </div>
        </CreditScoreHero>
      );
    }
  }

  if (error?.name === CreditReportFetchError.USER_IS_IN_VERIFICATION_PENDING) {
    return (
      <CreditScoreHero
        cardContent={
          <BelowScoreCta
            kycIncomplete={false}
            reportAvailable={false}
            onCtaClick={onCtaClick}
          />
        }
      >
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
          <p className="text-semibold mt-4">{t("kyc_in_progress")}</p>
        </div>
      </CreditScoreHero>
    );
  }
  if (error?.name === CreditReportFetchError.USER_IS_NOT_KYC_VERIFIED) {
    return (
      <CreditScoreHero
        cardContent={
          <BelowScoreCta
            kycIncomplete
            reportAvailable={false}
            onCtaClick={onCtaClick}
          />
        }
      >
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
      </CreditScoreHero>
    );
  }
  return (
    <CreditScoreHero
      cardContent={
        <BelowScoreCta
          kycIncomplete={false}
          reportAvailable={false}
          onCtaClick={onCtaClick}
        />
      }
    >
      <div className="text-center">
        <Image src={cardSearchErrorIconUrl} alt="Credit score not available" />
        <h2 className="text-heading text-semibold mt-4">
          {t("credit_score_na")}
        </h2>
        <p className="text-caption clr-text-secondary mt-2">
          {t("notify_when_available")}
        </p>
      </div>
    </CreditScoreHero>
  );
}

function BelowScoreCta(props: {
  kycIncomplete: boolean;
  reportAvailable: boolean;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
}) {
  const { t } = useTranslation("common");
  const APP_BASE_URL =
    process.env.NEXT_PUBLIC_APP_BASE_URL ?? "https://app.refyne.co.in/";

  const text = props.kycIncomplete
    ? "kyc_unlock_credit_score"
    : "learn_more_credit_score";
  const ctaLabel = props.kycIncomplete
    ? "complete_kyc_btn"
    : props.reportAvailable
    ? "see_full_credit_score_report"
    : "read_shorts_btn";

  function handleCtaClick() {
    const navigateTo = props.kycIncomplete
      ? APP_BASE_URL
      : props.reportAvailable
      ? "/credit-report/summary/detailed"
      : "/shorts#understanding-credit-score";
    const webviewRoute = props.kycIncomplete ? "dashboard" : undefined;
    props.onCtaClick(navigateTo, webviewRoute);
  }

  return (
    <div>
      <p className="text-medium text-center mb-3">{t(text)}</p>
      <button
        id={constructElementId({
          screenName: ScreenName.MONGU_CREDIT_REPORT_DASHBOARD,
          elementName: "HERO_CTA",
        })}
        className="btn btn-block btn-primary"
        onClick={handleCtaClick}
      >
        {t(ctaLabel)}
      </button>
    </div>
  );
}

interface CreditScoreHeroProps {
  children: ReactElement | Array<ReactElement>;
  cardContent: ReactElement;
  cardFooter?: ReactElement;
  cardFooterBackgroundColor?: string;
}

function CreditScoreHero({
  children,
  cardContent,
  cardFooter,
  cardFooterBackgroundColor,
}: CreditScoreHeroProps) {
  return (
    <div className={styles.CreditScore}>
      <div className={styles.CreditScore__Content}>{children}</div>
      <div className={styles.CreditScore__Footer}>
        <Card
          backgroundColor="var(--clr-pure-white)"
          footerBackgroundColor={cardFooterBackgroundColor}
          border="1px solid #EBF5FF"
          footer={cardFooter}
        >
          {cardContent}
        </Card>
      </div>
    </div>
  );
}

interface CreditScoreMeterWrapperProps {
  creditScore: number;
  creditScoreDifference: number | null;
  creditRating: CreditReportMetricRating;
  autoIncrementEffect?: boolean;
  fetchedAt?: string;
  expiresAt?: string;
  onTagClick?: () => void;
  onCtaClick: (navigateTo: string, webviewRoute?: string) => void;
}

function CreditScoreMeterWrapper({
  creditScore,
  creditScoreDifference,
  autoIncrementEffect,
  fetchedAt,
  expiresAt,
  onTagClick,
  onCtaClick,
  creditRating,
}: CreditScoreMeterWrapperProps) {
  const { t } = useTranslation("common");
  const [_score, setScore] = useDelayedStepChangeState(50, 5, 300);

  useEffect(() => {
    if (!autoIncrementEffect) return;
    setScore(creditScore);
    setCreditScoreIncrementEffectShown();
  }, [creditScore]);

  const scoreToBeDisplayed = autoIncrementEffect ? _score : creditScore;

  const isSyntheticScoreEqualsRealScore = creditScore === scoreToBeDisplayed;
  const creditScoreRating = creditRating.replaceAll("_", " ").toLowerCase();

  const creditScoreWillBeUpdatedIn: number | null = expiresAt
    ? differenceInDays(new Date(expiresAt), new Date())
    : null;

  const creditScoreHeroFooterProps: Partial<CreditScoreHeroProps> =
    isSyntheticScoreEqualsRealScore && creditScoreDifference
      ? {
          cardFooter: (
            <CreditScoreDifferenceText className="text-caption text-center">
              {creditScoreDifference}
            </CreditScoreDifferenceText>
          ),
          cardFooterBackgroundColor: getFooterBackgroundColorByScoreDifference(
            creditScoreDifference
          ),
        }
      : {};

  return (
    <CreditScoreHero
      cardContent={
        <BelowScoreCta
          kycIncomplete={false}
          reportAvailable
          onCtaClick={onCtaClick}
        />
      }
      {...creditScoreHeroFooterProps}
    >
      <div
        className="flex-center"
        id={constructElementId({
          screenName: ScreenName.MONGU_CREDIT_REPORT_DASHBOARD,
          elementName: "CREDIT_SCORE_METER",
        })}
      >
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
            <h2 className="text-title text-semibold mb-2">
              {scoreToBeDisplayed}
            </h2>
            {isSyntheticScoreEqualsRealScore ? (
              <Tag
                type={getTagTypeByCreditMetricRating(creditRating)}
                rightIcon={<Info size={16} />}
                onClick={onTagClick}
              >
                {creditScoreRating}
              </Tag>
            ) : (
              <Tag type="info-light">--</Tag>
            )}
          </div>
        </CreditScoreMeter>
      </div>
      <p className="text-caption clr-text-secondary text-center">
        {creditScoreWillBeUpdatedIn
          ? t("credit_report_next_update_in_days", {
              days: creditScoreWillBeUpdatedIn,
            })
          : t("credit_report_next_update")}
      </p>
    </CreditScoreHero>
  );
}
