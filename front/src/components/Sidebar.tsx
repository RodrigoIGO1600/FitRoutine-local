import { NavLink } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import { Icon } from "@iconify/react";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NAV_ICONS: Record<string, string> = {
  home: "solar:home-2-linear",
  history: "solar:clock-circle-linear",
  dumbbell: "solar:dumbbell-linear",
  settings: "solar:settings-linear",
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { to: "/", label: t("navRoutines"), icon: "home" },
    { to: "/history", label: t("navHistory"), icon: "history" },
    { to: "/exercises/new", label: t("navExercises"), icon: "dumbbell" },
    { to: "/settings", label: t("navSettings"), icon: "settings" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}>
      <div className="sidebar__header">
        <button
          type="button"
          className="sidebar__logo-btn"
          onClick={onToggle}
          aria-label={isOpen ? t("toggleMenu") : t("openMenu")}
          title={isOpen ? t("toggleMenu") : t("openMenu")}
        >
          <img src="/app-logo.png" alt="FitRoutine" className="sidebar__logo" />
        </button>
        {isOpen && (
          <>
            <span className="sidebar__brand">FitRoutine</span>
            <button
              type="button"
              className="sidebar__toggle"
              onClick={onToggle}
              aria-label={t("toggleMenu")}
            >
              <Icon icon="solar:close-linear" width={20} height={20} />
            </button>
          </>
        )}
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
            title={item.label}
          >
            <span className="sidebar__icon">
              <Icon icon={NAV_ICONS[item.icon]} width={22} height={22} />
            </span>
            {isOpen && <span className="sidebar__label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
