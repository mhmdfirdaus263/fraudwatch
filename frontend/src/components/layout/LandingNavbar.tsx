import {
  ArrowRight,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Brand } from "./Brand";

export function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu(): void {
    setMenuOpen(false);
  }

  return (
    <header className="landing-header">
      <div className="landing-header__inner">
        <Brand />

        <nav
          aria-label="Landing navigation"
          className={`landing-header__navigation ${
            menuOpen
              ? "landing-header__navigation--open"
              : ""
          }`}
          id="landing-navigation"
        >
          <a href="#how-it-works" onClick={closeMenu}>
            How It Works
          </a>

          <Link to="/model-insights" onClick={closeMenu}>
            Model
          </Link>

          <a href="#responsible-ai" onClick={closeMenu}>
            Responsible AI
          </a>

          <a
            href="http://127.0.0.1:8000/docs"
            onClick={closeMenu}
            rel="noreferrer"
            target="_blank"
          >
            API Docs
            <ExternalLink aria-hidden="true" size={14} />
          </a>
        </nav>

        <Link
          className="landing-header__action"
          onClick={closeMenu}
          to="/overview"
        >
          Open Dashboard
          <ArrowRight aria-hidden="true" size={18} />
        </Link>

        <button
          aria-controls="landing-navigation"
          aria-expanded={menuOpen}
          aria-label={
            menuOpen
              ? "Close landing navigation"
              : "Open landing navigation"
          }
          className="landing-header__menu-button"
          onClick={() =>
            setMenuOpen((currentValue) => !currentValue)
          }
          type="button"
        >
          {menuOpen ? (
            <X aria-hidden="true" size={22} />
          ) : (
            <Menu aria-hidden="true" size={22} />
          )}
        </button>
      </div>
    </header>
  );
}