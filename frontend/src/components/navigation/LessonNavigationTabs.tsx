import React, { useState, useRef, useEffect } from "react";
import {
  LessonNavigationTabsProps,
  NavigationSection,
  SectionType,
  LessonProgress,
  SECTION_ICONS,
  SECTION_DISPLAY_NAMES,
} from "../../types/navigation";

const LessonNavigationTabs: React.FC<LessonNavigationTabsProps> = ({
  sections,
  currentSection,
  onSectionChange,
  progress,
  compact = false,
  showIcons = true,
  showProgress = true,
  maxVisibleTabs = 5,
  className = "",
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  // Update scroll state
  const updateScrollState = () => {
    const container = tabsScrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setScrollPosition(scrollLeft);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Scroll tabs container
  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsScrollRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  // Calculate section progress
  const getSectionProgress = (section: NavigationSection): number => {
    if (!section.blocks.length) return 0;
    const completedBlocks = section.blocks.filter(
      (block) => block.completed,
    ).length;
    return Math.round((completedBlocks / section.blocks.length) * 100);
  };

  // Get section status indicator
  const getSectionStatus = (
    section: NavigationSection,
  ): "locked" | "available" | "completed" => {
    if (section.completed) return "completed";
    if (section.blocks.length === 0) return "locked";
    return "available";
  };

  // Check if section is accessible
  const isSectionAccessible = (
    section: NavigationSection,
    index: number,
  ): boolean => {
    // Introduction is always accessible
    if (section.name === "introduction") return true;

    // Check if previous sections are completed or current
    const currentIndex = sections.findIndex((s) => s.name === currentSection);
    return index <= currentIndex + 1;
  };

  // Scroll active tab into view
  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;

    const activeTab = container.querySelector(
      '[data-active="true"]',
    ) as HTMLElement;
    if (!activeTab) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    if (
      tabRect.left < containerRect.left ||
      tabRect.right > containerRect.right
    ) {
      const scrollLeft =
        activeTab.offsetLeft -
        container.clientWidth / 2 +
        activeTab.clientWidth / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentSection]);

  // Update scroll state on mount and scroll
  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener("scroll", updateScrollState);

    return () => container.removeEventListener("scroll", updateScrollState);
  }, [sections]);

  // Filter sections with content
  const availableSections = sections.filter(
    (section) => section.blocks.length > 0,
  );

  if (availableSections.length === 0) {
    return null;
  }

  return (
    <div
      className={`lesson-navigation-tabs ${compact ? "compact" : ""} ${className}`}
      ref={tabsContainerRef}
      style={{
        position: "relative",
        width: "100%",
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "12px",
        padding: "0.5rem",
        backdropFilter: "blur(var(--blur-amount))",
        WebkitBackdropFilter: "blur(var(--blur-amount))",
      }}
    >
      {/* Scroll Controls */}
      {(canScrollLeft || canScrollRight) && (
        <>
          {canScrollLeft && (
            <button
              className="scroll-button scroll-left"
              onClick={() => scrollTabs("left")}
              style={{
                position: "absolute",
                left: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "var(--glass-bg-active)",
                border: "1px solid var(--glass-border)",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "14px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-green)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--glass-bg-active)";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              ‹
            </button>
          )}

          {canScrollRight && (
            <button
              className="scroll-button scroll-right"
              onClick={() => scrollTabs("right")}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "var(--glass-bg-active)",
                border: "1px solid var(--glass-border)",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "14px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-green)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--glass-bg-active)";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              ›
            </button>
          )}
        </>
      )}

      {/* Tabs Container */}
      <div
        ref={tabsScrollRef}
        className="tabs-scroll-container"
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: canScrollLeft || canScrollRight ? "0 3rem" : "0",
          transition: "padding 0.3s ease",
        }}
      >
        {availableSections.map((section, index) => {
          const isActive = section.name === currentSection;
          const isAccessible = isSectionAccessible(section, index);
          const status = getSectionStatus(section);
          const progressPercentage = getSectionProgress(section);

          return (
            <button
              key={section.name}
              data-active={isActive}
              className={`section-tab ${isActive ? "active" : ""} ${status}`}
              onClick={() => isAccessible && onSectionChange(section.name)}
              disabled={!isAccessible}
              style={{
                flex: compact ? "0 0 auto" : "1 1 0",
                minWidth: compact ? "120px" : "140px",
                maxWidth: compact ? "160px" : "200px",
                height: compact ? "60px" : "80px",
                background: isActive
                  ? "var(--primary-green)"
                  : status === "completed"
                    ? "var(--glass-bg-hover)"
                    : status === "locked"
                      ? "var(--glass-bg)"
                      : "var(--glass-bg-hover)",
                border: isActive
                  ? "2px solid var(--primary-green)"
                  : status === "completed"
                    ? "1px solid var(--primary-green)"
                    : "1px solid var(--glass-border)",
                borderRadius: "10px",
                padding: compact ? "0.5rem" : "0.75rem",
                cursor: isAccessible ? "pointer" : "not-allowed",
                color: isActive
                  ? "white"
                  : status === "locked"
                    ? "var(--text-muted)"
                    : "var(--text-primary)",
                fontSize: compact ? "0.8rem" : "0.9rem",
                fontWeight: isActive ? "600" : "500",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: compact ? "0.25rem" : "0.5rem",
                position: "relative",
                overflow: "hidden",
                opacity: status === "locked" ? 0.6 : 1,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                if (isAccessible && !isActive) {
                  e.currentTarget.style.background = "var(--glass-bg-active)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.borderColor = "var(--primary-green)";
                }
              }}
              onMouseLeave={(e) => {
                if (isAccessible && !isActive) {
                  e.currentTarget.style.background =
                    status === "completed"
                      ? "var(--glass-bg-hover)"
                      : "var(--glass-bg-hover)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor =
                    status === "completed"
                      ? "var(--primary-green)"
                      : "var(--glass-border)";
                }
              }}
            >
              {/* Section Icon */}
              {showIcons && (
                <div
                  style={{
                    fontSize: compact ? "1.2rem" : "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {SECTION_ICONS[section.name] || "📄"}
                  {status === "completed" && (
                    <span
                      style={{
                        position: "absolute",
                        top: "0.25rem",
                        right: "0.25rem",
                        fontSize: "0.8rem",
                        color: isActive ? "white" : "var(--primary-green)",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              )}

              {/* Section Name */}
              <div
                style={{
                  textAlign: "center",
                  lineHeight: "1.2",
                  fontSize: compact ? "0.75rem" : "0.85rem",
                  fontWeight: "600",
                }}
              >
                {SECTION_DISPLAY_NAMES[section.name] || section.displayName}
              </div>

              {/* Block Count */}
              <div
                style={{
                  fontSize: compact ? "0.7rem" : "0.75rem",
                  opacity: 0.8,
                  fontWeight: "400",
                }}
              >
                {section.blocks.length} block
                {section.blocks.length !== 1 ? "s" : ""}
              </div>

              {/* Progress Bar */}
              {showProgress && progressPercentage > 0 && (
                <div
                  className="progress-bar"
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    height: "3px",
                    background: "rgba(255, 255, 255, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progressPercentage}%`,
                      height: "100%",
                      background: isActive
                        ? "rgba(255, 255, 255, 0.8)"
                        : "var(--primary-green)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              )}

              {/* Locked Overlay */}
              {status === "locked" && (
                <div
                  style={{
                    position: "absolute",
                    top: "0.25rem",
                    right: "0.25rem",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                  }}
                >
                  🔒
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Summary */}
      {showProgress && progress && !compact && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem",
            background: "var(--glass-bg-hover)",
            borderRadius: "8px",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Progress: {progress.completedSections}/{progress.totalSections}{" "}
            sections
          </span>
          <span>
            {progress.estimatedTimeRemaining > 0 &&
              `~${progress.estimatedTimeRemaining}min remaining`}
          </span>
        </div>
      )}
    </div>
  );
};

export default LessonNavigationTabs;
