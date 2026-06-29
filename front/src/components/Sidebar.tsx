import { NavLink } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { to: "/", label: "Rutinas", icon: "home" },
  { to: "/history", label: "Historial", icon: "history" },
  { to: "/exercises/new", label: "Ejercicios", icon: "dumbbell" },
];

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

  return null;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}>
      <div className="sidebar__header">
        <button
          type="button"
          className="sidebar__logo-btn"
          onClick={onToggle}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          title={isOpen ? "Cerrar menú" : "Abrir menú"}
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
              aria-label="Cerrar menú"
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
