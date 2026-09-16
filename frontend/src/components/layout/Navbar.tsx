import {
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Link,
  NavLink,
} from "react-router-dom";

import { Brand } from "./Brand";
import "./layout.css";

const navigationItems = [
  { label: "Overview", path: "/overview" },
  { label: "Analyze Transaction", path: "/analyze" },
  { label: "Review History", path: "/history" },
  { label: "Model Insights", path: "/model-insights" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Brand />

        <button
          className="navbar__menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav
          className={`navbar__navigation ${
            menuOpen ? "navbar__navigation--open" : ""
          }`}
          aria-label="Primary navigation"
        >
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `navbar__link ${
                  isActive ? "navbar__link--active" : ""
                }`
              }
              key={item.path}
              to={item.path}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}

          <div className="navbar__mobile-actions">
            <span className="model-status">
              <span className="model-status__dot" />
              Model Ready
            </span>

            <Link
              className="navbar__action"
              to="/analyze"
              onClick={closeMenu}
            >
              Run Analysis
              <ArrowRight size={18} />
            </Link>
          </div>
        </nav>

        <div className="navbar__desktop-actions">
          <span className="model-status">
            <span className="model-status__dot" />
            Model Ready
          </span>

          <Link className="navbar__action" to="/analyze">
            Run Analysis
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}