import React, { useState, useRef, useEffect } from "react";
import {
  LessonSwitcherProps,
  LessonMetadata,
  CategoryGroup,
  LessonFilterOptions,
  CompletionStatus,
} from "../../types/navigation";

const LessonSwitcher: React.FC<LessonSwitcherProps> = ({
  currentLesson,
  availableLessons,
  categoryGroups,
  recentLessons,
  onLessonSelect,
  onCategorySelect,
  searchEnabled = true,
  filterOptions,
  onFilterChange,
  maxRecentLessons = 5,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "recent" | "categories">(
    "all",
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchEnabled && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, searchEnabled]);

  // Filter lessons based on search and filters
  const filteredLessons = React.useMemo(() => {
    let lessons = availableLessons;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      lessons = lessons.filter(
        (lesson) =>
          lesson.name.toLowerCase().includes(query) ||
          lesson.description.toLowerCase().includes(query) ||
          lesson.category.toLowerCase().includes(query) ||
          lesson.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply category filter
    if (selectedCategory) {
      lessons = lessons.filter(
        (lesson) =>
          lesson.categorySlug === selectedCategory ||
          lesson.category === selectedCategory,
      );
    }

    // Apply additional filters
    if (filterOptions) {
      if (filterOptions.status && filterOptions.status.length > 0) {
        lessons = lessons.filter((lesson) =>
          filterOptions.status!.includes(lesson.completionStatus),
        );
      }

      if (filterOptions.difficulty && filterOptions.difficulty.length > 0) {
        lessons = lessons.filter((lesson) =>
          filterOptions.difficulty!.includes(lesson.difficulty),
        );
      }
    }

    return lessons;
  }, [availableLessons, searchQuery, selectedCategory, filterOptions]);

  // Get status color
  const getStatusColor = (status: CompletionStatus): string => {
    switch (status) {
      case "completed":
        return "var(--primary-green)";
      case "in-progress":
        return "#ffa500";
      case "not-started":
        return "var(--text-muted)";
      default:
        return "var(--text-muted)";
    }
  };

  // Get status icon
  const getStatusIcon = (status: CompletionStatus): string => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "🔄";
      case "not-started":
        return "⭕";
      default:
        return "⭕";
    }
  };

  // Handle lesson selection
  const handleLessonSelect = (lesson: LessonMetadata) => {
    onLessonSelect(lesson.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  // Render lesson item
  const renderLessonItem = (lesson: LessonMetadata, isRecent = false) => (
    <button
      key={lesson.id}
      className={`lesson-item ${currentLesson?.id === lesson.id ? "current" : ""}`}
      onClick={() => handleLessonSelect(lesson)}
      style={{
        width: "100%",
        padding: "0.75rem",
        background:
          currentLesson?.id === lesson.id
            ? "var(--primary-green)"
            : "transparent",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        transition: "all 0.2s ease",
        color:
          currentLesson?.id === lesson.id ? "white" : "var(--text-primary)",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        if (currentLesson?.id !== lesson.id) {
          e.currentTarget.style.background = "var(--glass-bg-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (currentLesson?.id !== lesson.id) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {/* Status Indicator */}
      <div
        style={{
          fontSize: "1rem",
          flexShrink: 0,
        }}
      >
        {getStatusIcon(lesson.completionStatus)}
      </div>

      {/* Lesson Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: "600",
            fontSize: "0.9rem",
            marginBottom: "0.25rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {lesson.name}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            opacity: 0.8,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>{lesson.category}</span>
          <span>•</span>
          <span>{lesson.estimatedDuration}min</span>
          {lesson.progressPercentage > 0 && (
            <>
              <span>•</span>
              <span>{lesson.progressPercentage}%</span>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {lesson.progressPercentage > 0 && (
        <div
          style={{
            width: "40px",
            height: "4px",
            background:
              currentLesson?.id === lesson.id
                ? "rgba(255, 255, 255, 0.3)"
                : "var(--glass-bg)",
            borderRadius: "2px",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${lesson.progressPercentage}%`,
              height: "100%",
              background:
                currentLesson?.id === lesson.id
                  ? "white"
                  : getStatusColor(lesson.completionStatus),
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      {/* Recent indicator */}
      {isRecent && (
        <div
          style={{
            fontSize: "0.7rem",
            color:
              currentLesson?.id === lesson.id
                ? "rgba(255, 255, 255, 0.8)"
                : "var(--text-muted)",
          }}
        >
          📕
        </div>
      )}
    </button>
  );

  return (
    <div
      className={`lesson-switcher ${className}`}
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      {/* Trigger Button */}
      <button
        className="lesson-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "var(--glass-bg-hover)",
          border: "1px solid var(--glass-border)",
          borderRadius: "10px",
          padding: "0.5rem 0.75rem",
          cursor: "pointer",
          color: "var(--text-primary)",
          fontSize: "0.9rem",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "all 0.2s ease",
          minWidth: "200px",
          justifyContent: "space-between",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--glass-bg-active)";
          e.currentTarget.style.borderColor = "var(--primary-green)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--glass-bg-hover)";
          e.currentTarget.style.borderColor = "var(--glass-border)";
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: 1,
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: "1rem" }}>📚</span>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {currentLesson ? currentLesson.name : "Select Lesson"}
          </span>
        </div>
        <span
          style={{
            transform: `rotate(${isOpen ? "180deg" : "0deg"})`,
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="lesson-switcher-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            marginTop: "0.5rem",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(var(--blur-amount))",
            WebkitBackdropFilter: "blur(var(--blur-amount))",
            border: "1px solid var(--glass-border)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxHeight: "400px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: "300px",
          }}
        >
          {/* Search Input */}
          {searchEnabled && (
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--glass-border)",
              }}
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  background: "var(--glass-bg)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary-green)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--glass-border)";
                }}
              />
            </div>
          )}

          {/* Tab Navigation */}
          <div
            style={{
              padding: "0.5rem",
              borderBottom: "1px solid var(--glass-border)",
              display: "flex",
              gap: "0.25rem",
            }}
          >
            {["all", "recent", "categories"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  background:
                    activeTab === tab ? "var(--primary-green)" : "transparent",
                  color: activeTab === tab ? "white" : "var(--text-primary)",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.5rem",
            }}
          >
            {activeTab === "all" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson) => renderLessonItem(lesson))
                ) : (
                  <div
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    No lessons found
                  </div>
                )}
              </div>
            )}

            {activeTab === "recent" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                {recentLessons.length > 0 ? (
                  recentLessons
                    .slice(0, maxRecentLessons)
                    .map((lesson) => renderLessonItem(lesson, true))
                ) : (
                  <div
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    No recent lessons
                  </div>
                )}
              </div>
            )}

            {activeTab === "categories" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {categoryGroups.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "var(--glass-bg-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
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
                          }}
                        >
                          {category.completedLessons}/{category.totalLessons}
                        </span>
                        <span
                          style={{
                            transform: `rotate(${selectedCategory === category.id ? "180deg" : "0deg"})`,
                            transition: "transform 0.2s ease",
                            fontSize: "0.8rem",
                          }}
                        >
                          ▼
                        </span>
                      </div>
                    </button>

                    {selectedCategory === category.id && (
                      <div
                        style={{
                          marginLeft: "1rem",
                          marginTop: "0.5rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem",
                        }}
                      >
                        {category.lessons.map((lesson) =>
                          renderLessonItem(lesson),
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonSwitcher;
