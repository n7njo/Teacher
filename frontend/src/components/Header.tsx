import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

interface Lesson {
  id: string;
  name: string;
  slug: string;
  topic_id: string;
}

interface HeaderProps {
  onNavigationToggle?: () => void;
  showNavigationToggle?: boolean;
  currentLessonData?: any;
}

const Header: React.FC<HeaderProps> = ({
  onNavigationToggle,
  showNavigationToggle = false,
  currentLessonData,
}) => {
  const location = useLocation();
  const isLessonPage = location.pathname.includes("/lesson/");
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);
  const [showLessonDropdown, setShowLessonDropdown] = useState(false);

  // Extract current lesson ID from path
  const currentLessonId = isLessonPage
    ? location.pathname.split("/lesson/")[1]
    : null;

  useEffect(() => {
    // Fetch available lessons for quick switching
    const fetchLessons = async () => {
      try {
        const response = await axios.get("/api/lessons");
        setAvailableLessons(response.data || []);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      }
    };

    if (isLessonPage) {
      fetchLessons();
    }
  }, [isLessonPage]);

  const currentLesson = availableLessons.find(
    (lesson) =>
      lesson.id === currentLessonId || lesson.slug === currentLessonId,
  );

  return (
    <header
      className="glass-card"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(var(--blur-amount))",
        WebkitBackdropFilter: "blur(var(--blur-amount))",
        padding: "0.75rem 1.5rem", // Reduced padding
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
          minHeight: "48px", // Compact height
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Navigation Toggle Button */}
          {(showNavigationToggle || isLessonPage) && (
            <button
              onClick={onNavigationToggle}
              className="nav-sidebar-toggle"
              style={{
                position: "static",
                background: "var(--glass-bg-hover)",
                border: "1px solid var(--glass-border)",
                borderRadius: "6px",
                padding: "0.375rem",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}

          {/* Brand Logo - Compact */}
          <Link
            to="/"
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "1.25rem", // Reduced size
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--gradient-accent)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.025em",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            SkillForge
          </Link>

          {/* Current Lesson Indicator and Quick Switcher */}
          {isLessonPage && (
            <>
              {/* Lesson Progress Indicator */}
              {currentLessonData && (
                <div
                  className="lesson-progress-indicator"
                  style={{
                    background: "var(--glass-bg-hover)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "6px",
                    padding: "0.375rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: "var(--text-muted)",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>Progress</span>
                  <div
                    style={{
                      width: "40px",
                      height: "4px",
                      background: "var(--glass-bg)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(() => {
                          if (!currentLessonData) return 0;
                          const totalBlocks: number = Object.values(
                            currentLessonData.sections,
                          ).reduce(
                            (total: number, section: any) =>
                              total +
                              (Array.isArray(section) ? section.length : 0),
                            0,
                          );
                          const completedBlocks: number = Object.values(
                            currentLessonData.sections,
                          ).reduce(
                            (total: number, section: any) =>
                              total +
                              (Array.isArray(section)
                                ? section.filter(
                                    (block: any) => block.completed,
                                  ).length
                                : 0),
                            0,
                          );
                          return totalBlocks > 0
                            ? (completedBlocks / totalBlocks) * 100
                            : 0;
                        })()}%`,
                        height: "100%",
                        background: "var(--primary-green)",
                        borderRadius: "2px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ position: "relative" }}>
                <button
                  className="lesson-switcher"
                  onClick={() => setShowLessonDropdown(!showLessonDropdown)}
                  style={{
                    background:
                      currentLesson?.id === currentLessonId
                        ? "var(--glass-bg-active)"
                        : "var(--glass-bg-hover)",
                    border: `1px solid ${
                      currentLesson?.id === currentLessonId
                        ? "var(--glass-border-strong)"
                        : "var(--glass-border)"
                    }`,
                    borderRadius: "6px",
                    padding: "0.375rem 0.75rem",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s ease",
                    maxWidth: "200px",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--glass-bg-active)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      currentLesson?.id === currentLessonId
                        ? "var(--glass-bg-active)"
                        : "var(--glass-bg-hover)";
                  }}
                >
                  {/* Active lesson indicator dot */}
                  {currentLesson?.id === currentLessonId && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-2px",
                        right: "-2px",
                        width: "8px",
                        height: "8px",
                        background: "var(--primary-green)",
                        borderRadius: "50%",
                        border: "2px solid white",
                        boxShadow: "0 0 0 1px var(--glass-border)",
                      }}
                    />
                  )}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentLesson?.name ||
                      currentLessonData?.name ||
                      "Current Lesson"}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: showLessonDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Lesson Dropdown */}
                {showLessonDropdown && (
                  <div
                    className="lesson-dropdown"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      marginTop: "0.5rem",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(var(--blur-amount))",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      boxShadow: "var(--shadow-glass)",
                      minWidth: "250px",
                      maxWidth: "350px",
                      maxHeight: "300px",
                      overflowY: "auto",
                      zIndex: 1100,
                    }}
                  >
                    <div
                      style={{
                        padding: "0.75rem",
                        borderBottom: "1px solid var(--glass-border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Switch Lesson
                      </div>
                    </div>
                    {availableLessons.length > 0 ? (
                      availableLessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/lesson/${lesson.id}`}
                          onClick={() => setShowLessonDropdown(false)}
                          style={{
                            display: "block",
                            padding: "0.75rem",
                            textDecoration: "none",
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid var(--glass-border)",
                            transition: "background 0.2s ease",
                            background:
                              lesson.id === currentLessonId ||
                              lesson.slug === currentLessonId
                                ? "var(--glass-bg-active)"
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "var(--glass-bg-hover)";
                          }}
                          onMouseLeave={(e) => {
                            const isCurrentLesson =
                              lesson.id === currentLessonId ||
                              lesson.slug === currentLessonId;
                            e.currentTarget.style.background = isCurrentLesson
                              ? "var(--glass-bg-active)"
                              : "transparent";
                          }}
                        >
                          <div style={{ fontWeight: "500" }}>{lesson.name}</div>
                        </Link>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          color: "var(--text-muted)",
                          fontSize: "0.875rem",
                        }}
                      >
                        No lessons available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Navigation Links - Compact */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {!isLessonPage && (
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
                padding: "0.375rem 0.75rem", // Reduced padding
                borderRadius: "6px",
                fontSize: "0.8rem", // Smaller font
                fontWeight: "600",
                transition: "all 0.2s ease",
                border: "1px solid var(--primary-green)",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
              Home
            </Link>
          )}

          {/* Compact Search Button */}
          <button
            className="btn btn-secondary"
            style={{
              padding: "0.375rem 0.75rem",
              fontSize: "0.8rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            Search
          </button>
        </div>
      </nav>

      {/* Click outside to close dropdown */}
      {showLessonDropdown && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setShowLessonDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;
