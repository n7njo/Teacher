import React from "react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onNavigationToggle?: () => void;
  showNavigationToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onNavigationToggle,
  showNavigationToggle = false,
}) => {
  const location = useLocation();
  const isLessonPage = location.pathname.includes("/lesson/");

  return (
    <header
      className="glass-card"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(var(--blur-amount))",
        WebkitBackdropFilter: "blur(var(--blur-amount))",
        padding: "1rem 2rem",
        borderBottom: "1px solid var(--glass-border)",
        borderRadius: 0,
        margin: 0,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-glass)",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Navigation Toggle Button */}
          {(showNavigationToggle || isLessonPage) && (
            <button
              onClick={onNavigationToggle}
              className="nav-sidebar-toggle"
              style={{
                position: "static",
                background: "var(--glass-bg-hover)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--glass-bg-active)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--glass-bg-hover)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ☰
            </button>
          )}

          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "1.5rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--gradient-accent)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🌱 SkillForge
          </Link>
        </div>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            to="/"
            className="btn btn-outline"
            style={{
              color:
                location.pathname === "/" ? "white" : "var(--primary-green)",
              background:
                location.pathname === "/"
                  ? "var(--primary-green)"
                  : "transparent",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
              border: "1px solid var(--primary-green)",
            }}
          >
            🏠 Home
          </Link>

          {/* Search Button (placeholder) */}
          <button
            className="btn btn-secondary"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🔍 Search
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
