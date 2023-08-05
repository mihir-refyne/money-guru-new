import type { Paths, I18n, Translate } from "next-translate/index";
import _useTranslation from "next-translate/useTranslation";

type Tail<T extends any[]> = ((...t: T) => void) extends (
  h: any,
  ...r: infer R
) => void
  ? R
  : never;

export interface TranslationsKeys {
  common: Paths<typeof import("../../locales/en/common.json")>;
}

export interface TypeSafeTranslate<Namespace extends keyof TranslationsKeys>
  extends Omit<I18n, "t"> {
  t: {
    (
      key: TranslationsKeys[Namespace],
      ...rest: Tail<Parameters<Translate>>
    ): string;
    <T extends string>(template: TemplateStringsArray): string;
  };
  /**
   * This is a separate ref of same `t` without type safety
   * Can be used for the place where text codes comes from
   * Remote server
   *
   * Only use for the above use case
   */
  tWithoutTypeSafety: I18n["t"];
}

export default function useTranslation<
  Namespace extends keyof TranslationsKeys
>(namespace?: Namespace): TypeSafeTranslate<Namespace> {
  const { t, lang } = _useTranslation(namespace);
  return {
    t,
    tWithoutTypeSafety: t,
    lang,
  };
}
