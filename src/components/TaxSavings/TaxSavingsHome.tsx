import ChevronRight from "@/images/chevron_right.svg";
import Banner from "@/images/tax-2024-banner.svg";
import Image from "next/image";
import { getTaxFor2023, getTaxFor2024 } from "./helpers";

export default function TaxSavingsHome({
  monthlyIncome = 70000,
  isLoggedIn = true,
}: {
  monthlyIncome?: number;
  isLoggedIn?: boolean;
}) {
  const yearlyIncome = monthlyIncome * 12;
  console.log(yearlyIncome);
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
        <h1 className="text-title-small text-center" style={{}}>
          How financial budget impacts on your salary
        </h1>
        <p className="text-center clr-text-secondary">as per budget</p>
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
          <p className="text-heading-small clr-text-secondary">
            Your income per month
          </p>
          <p
            className="text-heading-small"
            style={{
              filter: !isLoggedIn ? "blur(0.6rem)" : "",
            }}
          >
            ₹{monthlyIncome}
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
            <h2 className="text-heading-small">Savings</h2>
            <p
              className="text-title-small"
              style={{
                color: "var(--clr-text-accent-success)",
                filter: !isLoggedIn ? "blur(0.6rem)" : "",
              }}
            >
              ₹{taxDiff.toFixed(0)}
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
              <p className="text-body">Old Payable tax</p>
              <p className="text-caption clr-text-secondary">Budget 2023-24</p>
            </div>
            <p
              style={{
                filter: !isLoggedIn ? "blur(0.6rem)" : "",
              }}
            >
              ₹{tax2023.toFixed(0)}
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
              <p className="text-body">New Payable tax</p>
              <p className="text-caption clr-text-secondary">Budget 2024-25</p>
            </div>
            <p
              style={{
                filter: !isLoggedIn ? "blur(0.6rem)" : "",
              }}
            >
              ₹{tax2024.toFixed(0)}
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
              Info
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
              <div
                style={{
                  display: "flex",
                }}
              >
                <Image src={ChevronRight} alt="" />
                <p className="text-body">
                  ₹75,000 standard deduction on your taxable salary as per
                  budget 2024-25
                </p>
              </div>
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
