import { NavLink } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import type { Theme } from "../context/ThemeContext";
import "./SettingsPage.css";

const THEMES: { id: Theme; label: string; preview: string[] }[] = [
  {
    id: "dark",
    label: "Oscuro",
    preview: ["#1a242f", "#252f3d", "#1ec8a5"],
  },
  {
    id: "light",
    label: "Claro",
    preview: ["#f5f5f5", "#ffffff", "#10b981"],
  },
  {
    id: "sunset",
    label: "Sunset",
    preview: ["#1a1024", "#2a1a3a", "#f97316"],
  },
];

export function SettingsPage() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings">
      <header className="settings__header">
        <NavLink to="/" className="settings__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </NavLink>
        <h1 className="settings__title">{t("navSettings")}</h1>
      </header>

      <div className="settings__content">
        <section className="settings__section">
          <h2 className="settings__section-title">{t("settingsLanguage")}</h2>
          <div className="settings__language-grid">
            <button
              type="button"
              className={`settings__lang-btn ${language === "es" ? "settings__lang-btn--active" : ""}`}
              onClick={() => setLanguage("es")}
            >
              <span className="settings__lang-flag">🇪🇸</span>
              <span className="settings__lang-label">Español</span>
            </button>
            <button
              type="button"
              className={`settings__lang-btn ${language === "en" ? "settings__lang-btn--active" : ""}`}
              onClick={() => setLanguage("en")}
            >
              <span className="settings__lang-flag">🇬🇧</span>
              <span className="settings__lang-label">English</span>
            </button>
          </div>
        </section>

        <section className="settings__section">
          <h2 className="settings__section-title">{t("settingsTheme")}</h2>
          <div className="settings__theme-grid">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.id}
                type="button"
                className={`settings__theme-btn ${theme === themeOption.id ? "settings__theme-btn--active" : ""}`}
                onClick={() => setTheme(themeOption.id)}
              >
                <div className="settings__theme-preview">
                  <div
                    className="settings__theme-swatch"
                    style={{ background: themeOption.preview[0] }}
                  />
                  <div
                    className="settings__theme-swatch settings__theme-swatch--elevated"
                    style={{ background: themeOption.preview[1] }}
                  />
                  <div
                    className="settings__theme-accent"
                    style={{ background: themeOption.preview[2] }}
                  />
                </div>
                <span className="settings__theme-label">{themeOption.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
