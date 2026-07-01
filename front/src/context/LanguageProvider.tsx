import { useState, useEffect, type ReactNode } from "react";
import { LanguageContext } from "./LanguageContext";
import { t, type Language, type TranslationKey } from "../i18n";

const STORAGE_KEY = "fitroutine-language";

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") {
      return stored;
    }
  } catch {
    // ignore
  }
  return "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
  }

  function translate(key: TranslationKey, params?: Record<string, string | number>): string {
    return t(key, language, params);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}
