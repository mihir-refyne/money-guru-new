import LoadingPage from "@/components/LoadingPage";
import PageLayout from "@/components/PageLayout";
import TaxSavingsHome from "@/components/TaxSavings/TaxSavingsHome";
import { APP_BASE_URL } from "@/constants";
import useFetcher from "@/hooks/useFetcher";
import { getWorkerDetails } from "@/lib/core/user";
import { useRouter } from "next/router";
import TaxSavingsUIConfig from "../../../data/tax_budget_landing_config.json";

export default function TaxSavingsPage() {
  const { data, isLoading, error } = useFetcher(() => getWorkerDetails());
  const isLoggedIn = !!data;
  const router = useRouter();

  function redirectToLogin() {
    const returnDirectlyPostSignup = true;
    const queryParams = new URLSearchParams({
      utm_source: "tax_savings_budget_experiments_page",
      utm_medium: "web_link",
    });
    if (returnDirectlyPostSignup) {
      const returnURL = location.href;
      queryParams.set("preventAlternateSignUp", "true");
      queryParams.set("afterAuthRedirectBackToUrl", returnURL);
    }
    const url = `${APP_BASE_URL}/#/loginRegister?${queryParams.toString()}`;
    router.push(url);
  }

  function redirectToDashboard() {
    router.push(APP_BASE_URL);
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <PageLayout
      pageBackground="var(--clr-background-surface)"
      hasNavbar={false}
      hasContentPadding={false}
      footer={
        <div className="p-4">
          {!isLoggedIn && (
            <p
              className="text-center text-body"
              style={{
                paddingBottom: "1rem",
                color: "var(--clr-text-accent-success)",
              }}
            >
              {TaxSavingsUIConfig.footer_info_text}
            </p>
          )}
          <button
            onClick={isLoggedIn ? redirectToDashboard : redirectToLogin}
            className={`btn ${
              isLoggedIn ? "btn-primary-outline" : "btn-primary"
            } btn-block`}
          >
            {isLoggedIn
              ? TaxSavingsUIConfig.cta_text_authorized
              : TaxSavingsUIConfig.cta_text_unauthorized}
          </button>
        </div>
      }
    >
      <TaxSavingsHome
        isLoggedIn={isLoggedIn}
        monthlyIncome={data?.entity.currentMonthlySalary}
      />
    </PageLayout>
  );
}
