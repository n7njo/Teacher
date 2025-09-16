import React from "react";
import { Link } from "react-router-dom";
import {
  CompactHeaderProps,
  HeaderMode,
  SectionType,
} from "../../types/navigation";
import LessonNavigationTabs from "./LessonNavigationTabs";
import LessonSwitcher from "./LessonSwitcher";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import ProgressIndicator from "./ProgressIndicator";
import { useHeaderContext } from "../../hooks/useHeaderContext";
import { useLessonData } from "../../hooks/useLessonData";

const CompactHeader: React.FC<CompactHeaderProps> = ({
  navigationState,
  onLessonSwitch,
  onSectionChange,
  onModeToggle,
  onSearchChange,
  onPreferenceChange,
  className = "",
  style = {},
}) => {
  const {
    headerMode,
    breadcrumbItems,
    quickActions,
    showLessonTabs,
    showProgressIndicator,
    isCompactLayout,
  } = useHeaderContext(navigationState);

  const { lessons, categories, recentLessons } = useLessonData();

  // Convert lesson data to navigation sections for tabs
  const getNavigationSections = () => {
    if (
      !navigationState.currentLesson ||
      navigationState.currentLesson.type !== "modular"
    ) {
      return [];
    }

    // This would typically come from the lesson data
    // For now, we'll create a mock structure
    const sectionOrder: SectionType[] = [
      "introduction",
      "content",
      "practice",
      "assessment",
      "closure",
    ];

    return sectionOrder.map((sectionName, index) => ({
      name: sectionName,
      displayName: sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
      blocks: [], // Would be populated from actual lesson data
      completed: false,
      totalTimeMinutes: 0,
      completedTimeMinutes: 0,
      icon: "",
      order: index,
    }));
  };

  // Handle quick action clicks
  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find((a) => a.id === actionId);
    if (action) {
      action.action();
    }
  };

  // Render brand section
  const renderBrand = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      {/* Navigation Toggle for Mobile */}
      {isCompactLayout && showLessonTabs && (
        <button
          onClick={onModeToggle}
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
            width: "40px",
            height: "40px",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}

      {/* Brand Logo */}
      <Link
        to="/"
        style={{
          color: "var(--text-primary)",
          textDecoration: "none",
          fontSize: isCompactLayout ? "1.2rem" : "1.5rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "var(--gradient-accent)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.025em",
        }}
      >
        <svg
          width={isCompactLayout ? "24" : "28"}
          height={isCompactLayout ? "24" : "28"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        {!isCompactLayout && "SkillForge"}
      </Link>
    </div>
  );

  // Render navigation content based on mode
  const renderNavigationContent = () => {
    switch (headerMode) {
      case "lesson":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Lesson Switcher */}
            <LessonSwitcher
              currentLesson={navigationState.currentLesson}
              availableLessons={lessons}
              categoryGroups={categories}
              recentLessons={recentLessons}
              onLessonSelect={onLessonSwitch}
              onCategorySelect={(categoryId: string) =>
                console.log("Category selected:", categoryId)
              }
              searchEnabled={true}
            />

            {/* Progress Indicator */}
            {showProgressIndicator && navigationState.lessonProgress && (
              <ProgressIndicator
                progress={navigationState.lessonProgress}
                variant={isCompactLayout ? "compact" : "bar"}
                showPercentage={!isCompactLayout}
                size={isCompactLayout ? "small" : "medium"}
              />
            )}
          </div>
        );

      case "category":
      case "topic":
        return (
          <div style={{ flex: 1 }}>
            <NavigationBreadcrumb
              items={breadcrumbItems}
              maxItems={isCompactLayout ? 2 : 4}
              showIcons={!isCompactLayout}
            />
          </div>
        );

      case "home":
      default:
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Search Button */}
            <button
              className="btn btn-secondary"
              onClick={() => handleQuickAction("search")}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "600",
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
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              {!isCompactLayout && "Search"}
            </button>
          </div>
        );
    }
  };

  // Render quick actions
  const renderQuickActions = () => {
    const visibleActions = quickActions.filter((action) => action.visible);

    if (visibleActions.length === 0) return null;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {visibleActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action.id)}
            title={action.tooltip}
            style={{
              background: "var(--glass-bg-hover)",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
              color: "var(--text-primary)",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--glass-bg-active)";
              e.currentTarget.style.borderColor = "var(--primary-green)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--glass-bg-hover)";
              e.currentTarget.style.borderColor = "var(--glass-border)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {action.icon}
          </button>
        ))}
      </div>
    );
  };

  return (
    <header
      className={`compact-header ${className}`}
      style={{
        ...style,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(var(--blur-amount))",
        WebkitBackdropFilter: "blur(var(--blur-amount))",
        borderBottom: "1px solid var(--glass-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 16px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Main Header Bar */}
      <div
        style={{
          padding: isCompactLayout ? "0.75rem 1rem" : "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1400px",
          margin: "0 auto",
          gap: "1rem",
        }}
      >
        {/* Left Section - Brand */}
        {renderBrand()}

        {/* Center Section - Navigation Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          {renderNavigationContent()}
        </div>

        {/* Right Section - Quick Actions */}
        {renderQuickActions()}
      </div>

      {/* Lesson Tabs Row (when in lesson mode) */}
      {showLessonTabs && !isCompactLayout && (
        <div
          style={{
            padding: "0 2rem 0.75rem 2rem",
            maxWidth: "1400px",
            margin: "0 auto",
            borderTop: "1px solid var(--glass-border-light)",
          }}
        >
          <LessonNavigationTabs
            sections={getNavigationSections()}
            currentSection={navigationState.currentSection}
            onSectionChange={onSectionChange}
            progress={navigationState.lessonProgress}
            compact={isCompactLayout}
            showIcons={true}
            showProgress={navigationState.showProgressIndicators}
          />
        </div>
      )}

      {/* Mobile Lesson Tabs (compact mode) */}
      {showLessonTabs && isCompactLayout && (
        <div
          style={{
            padding: "0 1rem 0.75rem 1rem",
            borderTop: "1px solid var(--glass-border-light)",
          }}
        >
          <LessonNavigationTabs
            sections={getNavigationSections()}
            currentSection={navigationState.currentSection}
            onSectionChange={onSectionChange}
            progress={navigationState.lessonProgress}
            compact={true}
            showIcons={true}
            showProgress={false}
            maxVisibleTabs={3}
          />
        </div>
      )}
    </header>
  );
};

export default CompactHeader;
