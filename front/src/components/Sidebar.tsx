import { NavLink } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function SidebarIcon({ icon }: { icon: string }) {
  if (icon === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }

  if (icon === "history") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }

  if (icon === "dumbbell") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11M6.5 17.5h11" />
        <rect x="2" y="8" width="4" height="8" rx="1" />
        <rect x="18" y="8" width="4" height="8" rx="1" />
        <rect x="6" y="10" width="12" height="4" rx="1" />
      </svg>
    );
  }

  if (icon === "settings") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  return null;
}

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
          <span className="sidebar__logo">FR</span>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
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
              <SidebarIcon icon={item.icon} />
            </span>
            {isOpen && <span className="sidebar__label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
