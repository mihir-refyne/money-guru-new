import LocaleUpdateOptions from "@/components/LocaleUpdateOptions";
import PageLayout from "@/components/PageLayout";
import { setPreferredLocale } from "@/lib/locale";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SelectLocalePage() {
  const router = useRouter();
  const [selectedLocale, setSelectedLocale] = useState("en");

  function handleLocaleSelection() {
    setPreferredLocale(selectedLocale);
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
