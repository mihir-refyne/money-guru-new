import LocaleUpdateOptions from "@/components/LocaleUpdateOptions";
import PageLayout from "@/components/PageLayout";

export default function SelectLocale() {
  return (
    <PageLayout
      hasNavbar={false}
      footer={
        <div className="p-4">
          <button className="btn btn-primary btn-block">Proceed</button>
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <LocaleUpdateOptions locales={["en", "hi", "bn"]} />
      </div>
    </PageLayout>
  );
}
