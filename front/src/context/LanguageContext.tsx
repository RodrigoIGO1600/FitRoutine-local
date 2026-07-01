import { createContext, useContext } from "react";
import { t, type Language, type TranslationKey } from "../i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

export const LanguageContext = createContext<LanguageContextValue>({
  language: "es",
  setLanguage: () => {},
  t: (key) => key,
});

export function useTranslation() {
  return useContext(LanguageContext);
}

export function translate(
  key: TranslationKey,
  language: Language,
  params?: Record<string, string | number>
): string {
  return t(key, language, params);
}
