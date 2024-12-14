import Link from "next/link";
import FincoachUIConfigData from "../../../data/fincoach_config.json";

export default function FincoachLandingPage({}) {
  const pageTitle = FincoachUIConfigData.fincoach.pageTitle;
  const pageTitleHiglightedText =
    FincoachUIConfigData.fincoach.pageTitleHiglightedText;
  const pageDescription = FincoachUIConfigData.fincoach.pageDescription;
  const bookAppointmentCtaText =
    FincoachUIConfigData.fincoach.bookAppointmentCtaText;
  const imageUrl = FincoachUIConfigData.fincoach.imageUrl;
  const imageFooterHeading = FincoachUIConfigData.fincoach.imageFooterHeading;
  const imageFooterDescription =
    FincoachUIConfigData.fincoach.imageFooterDescription;
  const footerImage = FincoachUIConfigData.fincoach.footerImage;
  const whyRefyneFincoach = FincoachUIConfigData.fincoach.whyRefyneFincoach;
  const highlightedRefyneText =
    FincoachUIConfigData.fincoach.whyRefyneFincoach.highlightedRefyneText;
  const highlightedFincoachText =
    FincoachUIConfigData.fincoach.whyRefyneFincoach.highlightedFincoachText;
  const getAdviceHighlightedText =
    FincoachUIConfigData.fincoach.investments.getAdviceHighlightedText;
  const investments = FincoachUIConfigData.fincoach.investments;
  const financialCoaches = FincoachUIConfigData.fincoach.financialCoaches;
  const topFinancialCoachesHighlightedText =
    FincoachUIConfigData.fincoach.financialCoaches
      .topFinancialCoachesHighlightedText;
  const footerHeading = FincoachUIConfigData.fincoach.pageFooter.footerHeading;
  const footerDescription =
    FincoachUIConfigData.fincoach.pageFooter.footerDescription;
  const footerButtonText =
    FincoachUIConfigData.fincoach.pageFooter.footerButtonText;

  return (
    <>
      <div style={{ padding: "24px" }}>
        <section style={{ height: "auto" }}>
          <span
            style={{
              fontSize: "30px",
              fontWeight: "bolder",
              lineHeight: "1.2",
            }}
          >
            {pageTitle}
          </span>
          <span
            style={{
              fontSize: "30px",
              color: "#0057b7",
              fontWeight: "bolder",
              lineHeight: "1.2",
            }}
          >
            {pageTitleHiglightedText}
          </span>
          <p
            style={{
              whiteSpace: "pre-line",
              marginTop: "16px",
              color: "var(--clr-text-secondary)",
              fontSize: "16px",
            }}
          >
            {pageDescription}
          </p>
          <Link
            style={{
              textDecoration: "none",
            }}
            href="/fincoach/book-appointment"
          >
            <button
              style={{
                borderRadius: "24px",
                padding: "0 16px",
                marginTop: "24px",
              }}
              className="btn btn-primary"
            >
              {bookAppointmentCtaText}
            </button>
          </Link>
          <img
            style={{ height: "100%", width: "100%", objectFit: "contain" }}
            src={imageUrl}
            alt="img"
          />
          <p style={{ padding: "0 24px", textAlign: "center" }}>
            {imageFooterHeading}
          </p>
          <p
            style={{ textAlign: "center", marginTop: "8px", color: "#6b6f76" }}
          >
            {imageFooterDescription}
          </p>
        </section>
        <section style={{ marginTop: "48px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "bolder",
                  lineHeight: "1.2",
                  textAlign: "center",
                }}
              >
                {whyRefyneFincoach.heading}
              </span>
              <span
                style={{
                  fontSize: "30px",
                  color: "#0057b7",
                  fontWeight: "bolder",
                  lineHeight: "1.2",
                  textAlign: "center",
                }}
              >
                {highlightedRefyneText}
              </span>
            </div>

            <span
              style={{
                fontSize: "30px",
                color: "#0057b7",
                fontWeight: "bolder",
                lineHeight: "1.2",
                textAlign: "center",
              }}
            >
              {highlightedFincoachText}
            </span>
          </div>

          <div>
            {whyRefyneFincoach.benefits.map((benefit, idx) => {
              return (
                <div key={idx}>
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={benefit.imageUrl}
                    alt="img"
                  />
                  <h3 style={{ fontSize: "18px", whiteSpace: "pre-line" }}>
                    {benefit.heading}
                  </h3>
                  <p
                    style={{
                      color: "var(--clr-text-secondary)",
                      marginTop: "16px",
                      fontSize: "16px",
                    }}
                  >
                    {benefit.subHeading}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
        <section style={{ marginTop: "48px" }}>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontSize: "30px",
                color: "#0057b7",
                fontWeight: "bolder",
                lineHeight: "1.2",
              }}
            >
              {getAdviceHighlightedText}
            </span>
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bolder",
                lineHeight: "1.2",
              }}
            >
              {investments.heading}
            </span>
          </div>
          <div style={{ marginTop: "48px" }}>
            {investments.benefits.map((benefit, idx) => {
              return (
                <div
                  style={{
                    marginBottom: "8px",
                    background: "#f0f3f9",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                  key={idx}
                >
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={benefit.imageUrl}
                    alt="img"
                  />
                  <h3 style={{ fontSize: "18px", textAlign: "center" }}>
                    {benefit.heading}
                  </h3>
                  <p
                    style={{
                      color: "var(--clr-text-secondary)",
                      marginTop: "16px",
                      fontSize: "16px",
                    }}
                  >
                    {benefit.description}
                  </p>
                  <Link
                    href="/fincoach/book-appointment"
                    style={{ textDecoration: "none" }}
                  >
                    <button
                      style={{
                        color: "#0057b7",
                        margin: "16px 0",
                        fontSize: "16px",
                      }}
                      className="btn"
                    >
                      {benefit.ctaText}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
        <section style={{ marginTop: "48px" }}>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bolder",
                lineHeight: "1.2",
              }}
            >
              {financialCoaches.heading}
            </span>
            <span
              style={{
                fontSize: "30px",
                color: "#0057b7",
                fontWeight: "bolder",
                lineHeight: "1.2",
              }}
            >
              {topFinancialCoachesHighlightedText}
            </span>
          </div>
          <div style={{ marginTop: "48px" }}>
            {financialCoaches.coaches.map((coach, idx) => {
              return (
                <div
                  style={{
                    marginBottom: "8px",
                    background: "#f0f3f9",
                    borderRadius: "8px",
                    padding: "32px 16px",
                  }}
                  key={idx}
                >
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{ width: "80%", height: "80%" }}
                      src={coach.imageUrl}
                      alt="img"
                    />
                  </div>
                  <h2
                    style={{
                      textAlign: "center",
                      marginTop: "16px",
                      fontSize: "20px",
                    }}
                  >
                    {coach.name}
                  </h2>

                  <p
                    style={{
                      textAlign: "center",
                      margin: "24px 0",
                      fontSize: "20px",
                      letterSpacing: "4px",
                    }}
                  >
                    {coach.rating}
                  </p>

                  <h3
                    style={{
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    {coach.heading}
                  </h3>
                  <p
                    style={{
                      marginTop: "16px",
                      fontSize: "16px",
                      textAlign: "left",
                    }}
                  >
                    {coach.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <section
        style={{
          marginTop: "48px",
          background: "#0057b7",
          padding: " 16px",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "bolder",
            lineHeight: "1.2",
            color: "white",
          }}
        >
          {footerHeading}
        </h3>
        <p
          style={{
            fontSize: "16px",
            textAlign: "center",
            margin: "24px 0",
            color: "lightgray",
          }}
        >
          {footerDescription}
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link
            href="/fincoach/book-appointment"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                background: "white",
                color: "black",
                padding: "8px 16px",
              }}
              className="btn"
            >
              {footerButtonText}
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
