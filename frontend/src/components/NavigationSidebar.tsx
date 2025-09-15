import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

interface ContentBlock {
  id: string;
  title: string;
  type: string;
  estimatedTimeMinutes: number;
  completed?: boolean;
}

interface LessonSection {
  name: string;
  blocks: ContentBlock[];
  completed?: boolean;
}

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lessonData?: {
    id: string;
    name: string;
    description: string;
    sections: {
      introduction: ContentBlock[];
      content: ContentBlock[];
      practice: ContentBlock[];
      assessment: ContentBlock[];
      closure: ContentBlock[];
    };
  };
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  isOpen,
  onClose,
  lessonData,
}) => {
  const location = useLocation();
  const { lessonId } = useParams();
  const [currentSection, setCurrentSection] = useState("introduction");
  const [progress, setProgress] = useState(0);

  // Calculate progress based on completed blocks
  const calculateProgress = () => {
    if (!lessonData) return 0;

    const totalBlocks = Object.values(lessonData.sections).reduce(
      (total, section) => total + section.length,
      0,
    );

    const completedBlocks = Object.values(lessonData.sections).reduce(
      (total, section) =>
        total + section.filter((block) => block.completed).length,
      0,
    );

    return totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 0;
  };

  useEffect(() => {
    setProgress(calculateProgress());
  }, [lessonData]);

  const getSectionIcon = (sectionName: string) => {
    const icons: Record<string, string> = {
      introduction: "🚀",
      content: "📚",
      practice: "🔧",
      assessment: "📝",
      closure: "✨",
    };
    return icons[sectionName] || "📄";
  };

  const getBlockTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      text: "📖",
      video: "🎥",
      code: "💻",
      quiz: "❓",
      exercise: "🔨",
      interactive: "🎯",
      assessment: "📊",
    };
    return icons[type] || "📄";
  };

  const renderBreadcrumb = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);

    return (
      <div
        className="sidebar-breadcrumb"
        style={{
          padding: "1rem",
          borderBottom: "1px solid var(--glass-border)",
          fontSize: "0.9rem",
        }}
      >
        <Link
          to="/"
          style={{
            color: "var(--primary-green)",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          🏠 Home
        </Link>
        {pathParts.length > 0 && (
          <>
            <span style={{ margin: "0 0.5rem", opacity: 0.5 }}>›</span>
            <span style={{ color: "var(--text-muted)" }}>Lesson</span>
          </>
        )}
      </div>
    );
  };

  const renderProgressTracker = () => {
    if (!lessonData) return null;

    return (
      <div
        className="progress-tracker"
        style={{
          margin: "1rem",
          background: "var(--glass-bg-hover)",
          borderRadius: "12px",
          padding: "1rem",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--text-primary)",
            }}
          >
            Progress
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="progress-bar"
          style={{
            width: "100%",
            height: "6px",
            background: "var(--glass-bg)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "var(--gradient-accent)",
              borderRadius: "3px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>
    );
  };

  const renderLessonStructure = () => {
    if (!lessonData) return null;

    const sections = Object.entries(lessonData.sections).filter(
      ([_, blocks]) => blocks.length > 0,
    );

    return (
      <div className="lesson-structure" style={{ padding: "0 1rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            margin: "1.5rem 0 1rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          📚 {lessonData.name}
        </h3>

        {sections.map(([sectionName, blocks]) => {
          const isActiveSection = currentSection === sectionName;
          const sectionCompleted = blocks.every((block) => block.completed);

          return (
            <div
              key={sectionName}
              className="lesson-section"
              style={{ marginBottom: "1rem" }}
            >
              <button
                onClick={() =>
                  setCurrentSection(isActiveSection ? "" : sectionName)
                }
                style={{
                  width: "100%",
                  background: isActiveSection
                    ? "var(--glass-bg-active)"
                    : "var(--glass-bg)",
                  border: `1px solid ${isActiveSection ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {getSectionIcon(sectionName)}
                  <span>
                    {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      background: "var(--glass-bg)",
                      padding: "2px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {blocks.length}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {sectionCompleted && (
                    <span style={{ color: "var(--primary-green)" }}>✅</span>
                  )}
                  <span
                    style={{
                      transform: `rotate(${isActiveSection ? "180deg" : "0deg"})`,
                      transition: "transform 0.2s ease",
                      opacity: 0.6,
                    }}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {isActiveSection && (
                <div
                  className="section-blocks"
                  style={{
                    marginTop: "0.5rem",
                    marginLeft: "0.5rem",
                    borderLeft: "2px solid var(--glass-border)",
                    paddingLeft: "0.5rem",
                  }}
                >
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="block-item"
                      style={{
                        padding: "0.5rem 0.75rem",
                        margin: "0.25rem 0",
                        background: block.completed
                          ? "var(--glass-bg-hover)"
                          : "transparent",
                        borderRadius: "6px",
                        border: "1px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "0.85rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "var(--glass-bg-hover)";
                        e.currentTarget.style.borderColor =
                          "var(--glass-border)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = block.completed
                          ? "var(--glass-bg-hover)"
                          : "transparent";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flex: 1,
                          }}
                        >
                          {getBlockTypeIcon(block.type)}
                          <span
                            style={{
                              color: block.completed
                                ? "var(--text-primary)"
                                : "var(--text-muted)",
                              fontWeight: block.completed ? "500" : "400",
                            }}
                          >
                            {block.title}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                              background: "var(--glass-bg)",
                              padding: "1px 5px",
                              borderRadius: "8px",
                            }}
                          >
                            {block.estimatedTimeMinutes}min
                          </span>
                          {block.completed && (
                            <span style={{ color: "var(--primary-green)" }}>
                              ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(2px)",
            zIndex: 999,
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`nav-sidebar ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "360px",
          height: "100vh",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(var(--blur-amount))",
          borderRight: "1px solid var(--glass-border)",
          zIndex: 1000,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--glass-bg)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🧭 Navigation
          </h2>
          <button
            onClick={onClose}
            style={{
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
              width: "36px",
              height: "36px",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {renderBreadcrumb()}
          {renderProgressTracker()}
          {renderLessonStructure()}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid var(--glass-border)",
            background: "var(--glass-bg)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Link
            to="/"
            className="btn btn-outline"
            style={{
              width: "100%",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavigationSidebar;
