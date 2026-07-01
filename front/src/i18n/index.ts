import es from "./es";
import en from "./en";

export type Language = "es" | "en";

export type TranslationKey = keyof typeof es;

const translations = { es, en } as const;

export function t(key: TranslationKey, lang: Language, params?: Record<string, string | number>): string {
  const value = translations[lang][key] ?? translations.es[key] ?? key;

  if (!params) {
    return value;
  }

  let result: string = value;
  for (const [paramKey, paramValue] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue));
  }
  return result;
}

export { es, en };
