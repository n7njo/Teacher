import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        padding: "1rem 2rem",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          🧭 Compass Learning
        </Link>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            to="/"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              transition: "background 0.3s ease",
            }}
          >
            Home
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
