import Image from "next/image";
import languageIconUrl from "@/images/language-icon.svg";
import RadioButtonGroup from "../RadioButtonGroup";
import useTranslation from "@/hooks/useTranslation";

interface LocaleUpdateOptionsProps {
  locales?: Array<string>;
  currentValue?: string;
  onChange?: (value: string) => void;
}

export default function LocaleUpdateOptions({
  locales,
  currentValue,
  onChange,
}: LocaleUpdateOptionsProps) {
  const { t } = useTranslation("common");
  if (!locales || locales.length < 1) return null;
  const localeOptions = locales.map((locale) => ({
    value: locale,
    label: LOCALE_TO_LABEL_MAP[locale] ?? locale.toUpperCase(),
  }));

  return (
    <>
      <Image
        src={languageIconUrl}
        alt="icon"
        className="my-6"
        style={{
          height: "4.8rem",
          width: "4.8rem",
        }}
      />
      <h2 className="text-heading mb-6">{t("change_your_language")}</h2>
      <div className="mb-6" id="LOCALE_OPTIONS">
        <RadioButtonGroup
          items={localeOptions}
          name="locale-selector"
          value={currentValue}
          onChange={(e) => onChange?.(e.currentTarget.value)}
        />
      </div>
    </>
  );
}

const LOCALE_TO_LABEL_MAP: Record<string, string | undefined> = {
  en: "English",
  hi: "हिन्दी",
};
