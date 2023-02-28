import LocaleUpdateOptions from "@/components/LocaleUpdateOptions";
import PageLayout from "@/components/PageLayout";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logEventInMixpanel } from "@/lib/analytics/mixpanel";
import { setPreferredLocale } from "@/lib/locale";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectLocalePage() {
  const router = useRouter();
  const [selectedLocale, setSelectedLocale] = useState("en");

  useEffect(() => {
    console.log("locale selection");
    logEventInMixpanel(AnalyticEvent.FINLITERACY_LANGUAGE_SCREEN);
  }, []);

  function handleLocaleSelection() {
    setPreferredLocale(selectedLocale);
    logEventInMixpanel(AnalyticEvent.FINLITERACY_LANGUAGE_SCREEN_PROCEED, {
      locale: selectedLocale,
      location: "SCREEN",
    });
    router.replace("/", "/", { locale: selectedLocale });
  }

  return (
    <PageLayout
      hasNavbar={false}
      footer={
        <div className="p-4">
          <button
            className="btn btn-primary btn-block"
            onClick={handleLocaleSelection}
          >
            Proceed
          </button>
        </div>
      }
      alignContentCenter
    >
      <LocaleUpdateOptions
        locales={router.locales}
        currentValue={selectedLocale}
        onChange={setSelectedLocale}
      />
    </PageLayout>
  );
}

// TODO: Add locale here
export function getStaticProps() {
  return {
    props: {},
  };
}
