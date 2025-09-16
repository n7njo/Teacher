import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

interface Lesson {
  id: string;
  name: string;
  slug: string;
  topic_id: string;
  description?: string;
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
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentSection, setCurrentSection] = useState("introduction");
  const [progress, setProgress] = useState(0);
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);
  const [activeTab, setActiveTab] = useState<"current" | "lessons">("current");

  const isLessonPage = location.pathname.includes("/lesson/");
  const currentLessonId = isLessonPage ? lessonId : null;

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

  useEffect(() => {
    // Fetch available lessons for lesson switching
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

  const handleLessonSwitch = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
    onClose(); // Close sidebar after navigation
  };

  const getSectionIcon = (sectionName: string) => {
    const iconMap: Record<string, JSX.Element> = {
      introduction: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 16.5c-1.5 1.5-1.5 3.5 0 5s3.5 1.5 5 0l7-7-3-3-7 7z"></path>
          <path d="M15 3l6 6"></path>
        </svg>
      ),
      content: (
        <svg
          width="16"
          height="16"
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
      ),
      practice: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      assessment: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      closure: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ),
    };
    return (
      iconMap[sectionName] || (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
        </svg>
      )
    );
  };

  const getBlockTypeIcon = (type: string) => {
    const iconMap: Record<string, JSX.Element> = {
      text: (
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      video: (
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
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      ),
      code: (
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
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      quiz: (
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
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
      exercise: (
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
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      interactive: (
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
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6"></path>
          <path d="m21 12-6 0m-6 0-6 0"></path>
        </svg>
      ),
      assessment: (
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
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
    };
    return (
      iconMap[type] || (
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
        </svg>
      )
    );
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
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
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

  const renderTabsInterface = () => {
    if (!isLessonPage) return null;

    return (
      <div
        style={{
          borderBottom: "1px solid var(--glass-border)",
          background: "var(--glass-bg)",
          padding: "0 1rem",
        }}
      >
        <div
          className="sidebar-tabs"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <button
            onClick={() => setActiveTab("current")}
            style={{
              background:
                activeTab === "current"
                  ? "var(--primary-green)"
                  : "transparent",
              color: activeTab === "current" ? "white" : "var(--text-primary)",
              border: "none",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
              borderRadius: "6px 6px 0 0",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Current
          </button>
          <button
            onClick={() => setActiveTab("lessons")}
            style={{
              background:
                activeTab === "lessons"
                  ? "var(--primary-green)"
                  : "transparent",
              color: activeTab === "lessons" ? "white" : "var(--text-primary)",
              border: "none",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
              borderRadius: "6px 6px 0 0",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            Lessons
            {availableLessons.length > 0 && (
              <span
                style={{
                  background:
                    activeTab === "lessons"
                      ? "rgba(255,255,255,0.2)"
                      : "var(--glass-bg-hover)",
                  color:
                    activeTab === "lessons" ? "white" : "var(--text-muted)",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                }}
              >
                {availableLessons.length}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderLessonsList = () => {
    if (activeTab !== "lessons" || !isLessonPage) return null;

    return (
      <div style={{ padding: "1rem" }}>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          All Lessons
        </div>

        {availableLessons.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {availableLessons.map((lesson) => {
              const isCurrentLesson =
                lesson.id === currentLessonId ||
                lesson.slug === currentLessonId;

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSwitch(lesson.id)}
                  style={{
                    background: isCurrentLesson
                      ? "var(--glass-bg-active)"
                      : "var(--glass-bg)",
                    border: `1px solid ${isCurrentLesson ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentLesson) {
                      e.currentTarget.style.background =
                        "var(--glass-bg-hover)";
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentLesson) {
                      e.currentTarget.style.background = "var(--glass-bg)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "500",
                          color: "var(--text-primary)",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {lesson.name}
                      </div>
                      {lesson.description && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            lineHeight: "1.4",
                          }}
                        >
                          {lesson.description.length > 60
                            ? lesson.description.substring(0, 60) + "..."
                            : lesson.description}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {isCurrentLesson && (
                        <span
                          style={{
                            background: "var(--primary-green)",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "8px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                          }}
                        >
                          CURRENT
                        </span>
                      )}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 1rem",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
            <div>No lessons available</div>
          </div>
        )}
      </div>
    );
  };

  const renderLessonStructure = () => {
    if (!lessonData || activeTab !== "current") return null;

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
          <svg
            width="16"
            height="16"
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
          {lessonData.name}
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
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            Navigation
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
          {renderTabsInterface()}
          {renderLessonStructure()}
          {renderLessonsList()}
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
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg
              width="16"
              height="16"
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
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavigationSidebar;
