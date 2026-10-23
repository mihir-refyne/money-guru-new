import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import Link from "next/link";
import FincoachUIConfigData from "../../../data/fincoach_config.json";
import styles from "./styles.module.css";

const { fincoach } = FincoachUIConfigData;

const heroDescriptionParagraphs = fincoach.pageDescription
  .split("\n\n")
  .map((paragraph) => paragraph.trim())
  .filter(Boolean);

function handleBookAppointmentClick(source: string) {
  logMoneyGuruEvent(AnalyticEvent.COACHING_CLICKED, { source });
}

export default function FincoachLandingPage() {
  return (
    <>
      <div className={styles.Fincoach}>
        <section>
          <h1 className={styles.Fincoach__SectionHeading}>
            {fincoach.pageTitle}
            <span className={styles.Fincoach__Highlight}>
              {fincoach.pageTitleHiglightedText}
            </span>
          </h1>
          {heroDescriptionParagraphs.map((paragraph, idx) => (
            <p key={idx} className={styles.Fincoach__HeroDescription}>
              {paragraph}
            </p>
          ))}
          <Link
            href="/fincoach/book-appointment"
            style={{ textDecoration: "none" }}
          >
            <button
              className={`btn btn-primary ${styles.Fincoach__HeroCta}`}
              onClick={() => handleBookAppointmentClick("hero")}
            >
              {fincoach.bookAppointmentCtaText}
            </button>
          </Link>
          <img
            className={styles.Fincoach__HeroImage}
            src={fincoach.imageUrl}
            alt=""
          />
          <p className={styles.Fincoach__HeroImageFooter}>
            {fincoach.imageFooterHeading}
          </p>
          <p className={styles.Fincoach__HeroImageFooterSub}>
            {fincoach.imageFooterDescription}
          </p>
        </section>

        <section className={styles.Fincoach__Section}>
          <h2 className={styles.Fincoach__SectionHeading}>
            {fincoach.whyRefyneFincoach.heading}
            <span className={styles.Fincoach__Highlight}>
              {fincoach.whyRefyneFincoach.highlightedRefyneText}
            </span>
            <span className={styles.Fincoach__Highlight}>
              {fincoach.whyRefyneFincoach.highlightedFincoachText}
            </span>
          </h2>
          <div className={styles.Fincoach__ScrollRow}>
            {fincoach.whyRefyneFincoach.benefits.map((benefit, idx) => (
              <div className={styles.Fincoach__Card} key={idx}>
                <img
                  className={styles.Fincoach__Card__Image}
                  src={benefit.imageUrl}
                  alt=""
                />
                <h3 className={styles.Fincoach__Card__Heading}>
                  {benefit.heading}
                </h3>
                <p className={styles.Fincoach__Card__Description}>
                  {benefit.subHeading}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.Fincoach__Section}>
          <h2 className={styles.Fincoach__SectionHeading}>
            <span className={styles.Fincoach__Highlight}>
              {fincoach.investments.getAdviceHighlightedText}
            </span>
            {fincoach.investments.heading}
          </h2>
          <div className={styles.Fincoach__ScrollRow}>
            {fincoach.investments.benefits.map((benefit, idx) => (
              <div className={styles.Fincoach__Card} key={idx}>
                <img
                  className={styles.Fincoach__Card__Image}
                  src={benefit.imageUrl}
                  alt=""
                />
                <h3 className={styles.Fincoach__Card__Heading}>
                  {benefit.heading}
                </h3>
                <p className={styles.Fincoach__Card__Description}>
                  {benefit.description}
                </p>
                <Link
                  href="/fincoach/book-appointment"
                  style={{ textDecoration: "none" }}
                >
                  <button
                    className={styles.Fincoach__Card__Cta}
                    onClick={() => handleBookAppointmentClick(benefit.heading)}
                  >
                    {benefit.ctaText}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.Fincoach__Section}>
          <h2 className={styles.Fincoach__SectionHeading}>
            {fincoach.financialCoaches.heading}
            <span className={styles.Fincoach__Highlight}>
              {fincoach.financialCoaches.topFinancialCoachesHighlightedText}
            </span>
          </h2>
          <div className={styles.Fincoach__ScrollRow}>
            {fincoach.financialCoaches.coaches.map((coach, idx) => (
              <div className={styles.Fincoach__CoachCard} key={idx}>
                <img
                  className={styles.Fincoach__CoachCard__Image}
                  src={coach.imageUrl}
                  alt=""
                />
                <h3 className={styles.Fincoach__CoachCard__Name}>
                  {coach.name}
                </h3>
                <p className={styles.Fincoach__CoachCard__Rating}>
                  {coach.rating} {coach.heading}
                </p>
                <p className={styles.Fincoach__CoachCard__Description}>
                  {coach.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.Fincoach__FooterCta}>
        <h2 className={styles.Fincoach__FooterCta__Heading}>
          {fincoach.pageFooter.footerHeading}
        </h2>
        <p className={styles.Fincoach__FooterCta__Description}>
          {fincoach.pageFooter.footerDescription}
        </p>
        <Link
          href="/fincoach/book-appointment"
          style={{ textDecoration: "none" }}
        >
          <button
            className={styles.Fincoach__FooterCta__Button}
            onClick={() => handleBookAppointmentClick("footer")}
          >
            {fincoach.pageFooter.footerButtonText}
          </button>
        </Link>
      </section>
    </>
  );
}
