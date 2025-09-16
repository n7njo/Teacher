import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationBreadcrumbProps,
  BreadcrumbItem,
} from "../../types/navigation";

const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  items,
  maxItems = 4,
  showIcons = true,
  separator = "›",
  className = "",
}) => {
  // Truncate items if there are too many
  const displayItems = React.useMemo(() => {
    if (items.length <= maxItems) {
      return items;
    }

    // Always show home, then ellipsis, then last few items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 2));

    return [
      firstItem,
      {
        label: "...",
        path: "#",
        isActive: false,
        isClickable: false,
      },
      ...lastItems,
    ];
  }, [items, maxItems]);

  return (
    <nav
      className={`navigation-breadcrumb ${className}`}
      aria-label="Breadcrumb navigation"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.9rem",
        color: "var(--text-muted)",
        flexWrap: "wrap",
      }}
    >
      {displayItems.map((item, index) => (
        <React.Fragment key={`${item.path}-${index}`}>
          {/* Breadcrumb Item */}
          <div
            className={`breadcrumb-item ${item.isActive ? "active" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: item.isActive
                ? "var(--text-primary)"
                : "var(--text-muted)",
              fontWeight: item.isActive ? "600" : "400",
            }}
          >
            {item.isClickable ? (
              <Link
                to={item.path}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--glass-bg-hover)";
                  e.currentTarget.style.color = "var(--primary-green)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                {showIcons && item.icon && (
                  <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                )}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                {showIcons && item.icon && (
                  <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                )}
                <span>{item.label}</span>
              </span>
            )}
          </div>

          {/* Separator */}
          {index < displayItems.length - 1 && (
            <span
              className="breadcrumb-separator"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                opacity: 0.6,
                userSelect: "none",
              }}
            >
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default NavigationBreadcrumb;
