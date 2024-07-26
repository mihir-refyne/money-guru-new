import ChevronRight from "@/images/chevron_right.svg";
import Banner from "@/images/tax-2024-banner.webp";
import { formatToInr } from "@/lib/utils";
import Image from "next/image";
import TaxSavingsUIConfig from "../../../data/tax_budget_landing_config.json";
import { getTaxFor2023, getTaxFor2024 } from "./helpers";

export default function TaxSavingsHome({
  monthlyIncome = 70000,
  isLoggedIn = false,
}: {
  monthlyIncome?: number;
  isLoggedIn?: boolean;
}) {
  const yearlyIncome = monthlyIncome * 12;
  const tax2023 = getTaxFor2023(yearlyIncome);
  const tax2024 = getTaxFor2024(yearlyIncome);
  const taxDiff = tax2023 - tax2024;

  return (
    <>
      <Image
        src={Banner}
        alt="Tax Banner"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          marginTop: "2.4rem",
          padding: "0 1.2rem",
        }}
      >
        <style jsx global>{`
          * {
            font-family: var(--font-inter);
          }
        `}</style>
        <h1 className="text-title-small text-center text-semibold" style={{}}>
          {TaxSavingsUIConfig.main_title}
        </h1>
        <p
          className="text-center clr-text-secondary text-body"
          style={{
            marginTop: "0.8rem",
          }}
        >
          {TaxSavingsUIConfig.main_sub_text}
        </p>
        <div
          className=""
          style={{
            padding: "1.6rem 1.2rem",
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.6rem",
            background: "var(--clr-background-enabled)",
            borderRadius: "1.2rem",
            border: "1px solid var(--clr-border-enabled)",
          }}
        >
          <p className="text-heading-small clr-text-secondary text-semibold">
            {TaxSavingsUIConfig.income_per_month_text}
          </p>
          <p
            className="text-heading-small text-semibold"
            style={{
              filter: !isLoggedIn ? "blur(0.6rem)" : "",
            }}
          >
            {formatToInr(monthlyIncome)}
          </p>
        </div>
        <div
          className=""
          style={{
            marginTop: "1.6rem",
            background: "var(--clr-background-enabled)",
            borderRadius: "1.2rem",
            border: "1px solid var(--clr-border-enabled)",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1.2rem 0",
              background: "var(--clr-background-accent-success)",
            }}
          >
            <h2 className="text-heading-small text-semibold">
              {TaxSavingsUIConfig.savings_card_title}
            </h2>
            <p
              className="text-title-small text-semibold"
              style={{
                color: "var(--clr-text-accent-success)",
                filter: !isLoggedIn ? "blur(0.6rem)" : "",
              }}
            >
              {formatToInr(taxDiff)}
            </p>
          </div>
          <div
            style={{
              padding: "1.6rem 1.2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "left",
              }}
            >
              <p className="text-body">{TaxSavingsUIConfig.old_tax_heading}</p>
              <p className="text-caption clr-text-secondary">
                {TaxSavingsUIConfig.old_tax_description}
              </p>
            </div>
            <p
              style={{
                filter: !isLoggedIn ? "blur(0.6rem)" : "",
              }}
              className="text-heading-small text-semibold clr-text-secondary"
            >
              {formatToInr(tax2023)}
            </p>
          </div>
          <div
            style={{
              border: "1px solid var(--clr-border-enabled)",
              margin: "0 1.2rem",
            }}
          ></div>
          <div
            style={{
              padding: "1.6rem 1.2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "left",
              }}
            >
              <p className="text-body">{TaxSavingsUIConfig.new_tax_heading}</p>
              <p className="text-caption clr-text-secondary">
                {TaxSavingsUIConfig.new_tax_description}
              </p>
            </div>
            <p
              style={{
                filter: !isLoggedIn ? "blur(0.6rem)" : "",
              }}
              className="text-heading-small text-semibold clr-text-secondary"
            >
              {formatToInr(tax2024)}
            </p>
          </div>
        </div>
        {isLoggedIn && (
          <div
            className=""
            style={{
              marginTop: "1.6rem",
              background: "var(--clr-background-enabled)",
              borderRadius: "1.2rem",
              border: "1px solid var(--clr-border-enabled)",
              overflow: "hidden",
            }}
          >
            <h2
              className="text-heading-small clr-text-secondary"
              style={{
                margin: "1.2rem",
              }}
            >
              {TaxSavingsUIConfig.info_card_heading}
            </h2>
            <div
              style={{
                border: "1px solid var(--clr-border-enabled)",
                marginTop: "1.2rem",
              }}
            />
            <div
              style={{
                padding: "1.6rem 1.2rem",
              }}
            >
              {TaxSavingsUIConfig.info_card_items.map((item, i) => {
                return (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      marginTop: i > 0 ? "1.2rem" : undefined,
                    }}
                  >
                    <Image src={ChevronRight} alt="" />
                    <p className="text-body">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: "3rem",
        }}
      ></div>
    </>
  );
}
