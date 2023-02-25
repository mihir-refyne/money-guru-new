import RadioButtonGroup from "@/components/RadioButtonGroup";
import languageIconUrl from "@/images/language-icon.svg";
import Image from "next/image";

export default function SelectLocale() {
  return (
    <div className="container-wrapper">
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Image
          src={languageIconUrl}
          alt="icon"
          className="my-6"
          style={{
            height: "4.8rem",
            width: "4.8rem",
          }}
        />
        <h2 className="text-heading mb-6">Change Your Language</h2>
        <div className="mb-6">
          <RadioButtonGroup
            items={[
              {
                label: "English",
                value: "en",
              },
              {
                label: "Hindi",
                value: "hi",
              },
              {
                label: "Hindi 2",
                value: "hi2",
              },
            ]}
            name="locale-selector"
          />
        </div>
      </div>
      <div className="footer">
        <div className="container">
          <button className="btn btn-primary btn-block">Proceed</button>
        </div>
      </div>
    </div>
  );
}
