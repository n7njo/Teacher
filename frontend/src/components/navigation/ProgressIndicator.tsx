import React from "react";
import { ProgressIndicatorProps, LessonProgress } from "../../types/navigation";

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  variant = "bar",
  showPercentage = true,
  showTimeRemaining = false,
  showSectionBreakdown = false,
  size = "medium",
  animated = true,
  className = "",
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(
    100,
    Math.max(0, progress.progressPercentage),
  );

  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case "small":
        return { height: "4px", fontSize: "0.75rem", padding: "0.25rem" };
      case "large":
        return { height: "8px", fontSize: "1rem", padding: "0.75rem" };
      case "medium":
      default:
        return { height: "6px", fontSize: "0.875rem", padding: "0.5rem" };
    }
  };

  const dimensions = getSizeDimensions();

  // Format time remaining
  const formatTimeRemaining = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  // Render bar variant
  const renderBarVariant = () => (
    <div
      className={`progress-indicator-bar ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: dimensions.padding,
        background: "var(--glass-bg-hover)",
        borderRadius: "8px",
        border: "1px solid var(--glass-border)",
        fontSize: dimensions.fontSize,
        minWidth: "120px",
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          flex: 1,
          height: dimensions.height,
          background: "var(--glass-bg)",
          borderRadius: `${parseInt(dimensions.height) / 2}px`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: "var(--gradient-accent)",
            borderRadius: `${parseInt(dimensions.height) / 2}px`,
            transition: animated
              ? "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
            position: "relative",
          }}
        >
          {/* Shimmer effect for animation */}
          {animated && progressPercentage > 0 && progressPercentage < 100 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "shimmer 2s infinite",
              }}
            />
          )}
        </div>
      </div>

      {/* Progress Text */}
      {showPercentage && (
        <span
          style={{
            color: "var(--text-primary)",
            fontWeight: "600",
            fontSize: dimensions.fontSize,
            minWidth: "3rem",
            textAlign: "right",
          }}
        >
          {Math.round(progressPercentage)}%
        </span>
      )}

      {/* Time Remaining */}
      {showTimeRemaining && progress.estimatedTimeRemaining > 0 && (
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: `calc(${dimensions.fontSize} * 0.9)`,
            whiteSpace: "nowrap",
          }}
        >
          {formatTimeRemaining(progress.estimatedTimeRemaining)} left
        </span>
      )}
    </div>
  );

  // Render circle variant
  const renderCircleVariant = () => {
    const circleSize = size === "small" ? 32 : size === "large" ? 48 : 40;
    const strokeWidth = size === "small" ? 3 : size === "large" ? 4 : 3;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset =
      circumference - (progressPercentage / 100) * circumference;

    return (
      <div
        className={`progress-indicator-circle ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: dimensions.fontSize,
        }}
      >
        {/* SVG Circle */}
        <div style={{ position: "relative" }}>
          <svg
            width={circleSize}
            height={circleSize}
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Background circle */}
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="var(--glass-border)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="var(--primary-green)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: animated
                  ? "stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
              }}
            />
          </svg>

          {/* Percentage in center */}
          {showPercentage && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: `calc(${dimensions.fontSize} * 0.8)`,
                fontWeight: "600",
                color: "var(--text-primary)",
              }}
            >
              {Math.round(progressPercentage)}%
            </div>
          )}
        </div>

        {/* Additional info */}
        {(showTimeRemaining || showSectionBreakdown) && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {showSectionBreakdown && (
              <span
                style={{
                  fontSize: `calc(${dimensions.fontSize} * 0.85)`,
                  color: "var(--text-muted)",
                }}
              >
                {progress.completedSections}/{progress.totalSections} sections
              </span>
            )}
            {showTimeRemaining && progress.estimatedTimeRemaining > 0 && (
              <span
                style={{
                  fontSize: `calc(${dimensions.fontSize} * 0.85)`,
                  color: "var(--text-muted)",
                }}
              >
                {formatTimeRemaining(progress.estimatedTimeRemaining)} left
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render compact variant
  const renderCompactVariant = () => (
    <div
      className={`progress-indicator-compact ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: dimensions.fontSize,
      }}
    >
      {/* Compact progress dot */}
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: `conic-gradient(var(--primary-green) ${progressPercentage * 3.6}deg, var(--glass-border) 0deg)`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: "2px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--glass-bg)",
          }}
        />
      </div>

      {/* Compact text */}
      <span
        style={{
          color: "var(--text-primary)",
          fontWeight: "500",
          fontSize: `calc(${dimensions.fontSize} * 0.9)`,
        }}
      >
        {Math.round(progressPercentage)}%
      </span>
    </div>
  );

  // Render detailed variant
  const renderDetailedVariant = () => (
    <div
      className={`progress-indicator-detailed ${className}`}
      style={{
        background: "var(--glass-bg-hover)",
        border: "1px solid var(--glass-border)",
        borderRadius: "12px",
        padding: "1rem",
        fontSize: dimensions.fontSize,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
          Lesson Progress
        </span>
        <span style={{ fontWeight: "600", color: "var(--primary-green)" }}>
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "var(--glass-bg)",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: "var(--gradient-accent)",
            borderRadius: "4px",
            transition: animated
              ? "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          }}
        />
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "0.5rem",
          fontSize: `calc(${dimensions.fontSize} * 0.85)`,
          color: "var(--text-muted)",
        }}
      >
        <div>
          <span style={{ fontWeight: "500" }}>Sections:</span>
          <br />
          {progress.completedSections}/{progress.totalSections}
        </div>
        <div>
          <span style={{ fontWeight: "500" }}>Blocks:</span>
          <br />
          {progress.completedBlocks}/{progress.totalBlocks}
        </div>
        {progress.estimatedTimeRemaining > 0 && (
          <div>
            <span style={{ fontWeight: "500" }}>Time Left:</span>
            <br />
            {formatTimeRemaining(progress.estimatedTimeRemaining)}
          </div>
        )}
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case "circle":
      return renderCircleVariant();
    case "compact":
      return renderCompactVariant();
    case "detailed":
      return renderDetailedVariant();
    case "bar":
    default:
      return renderBarVariant();
  }
};

// Add keyframes for shimmer animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }
  `;
  document.head.appendChild(style);
}

export default ProgressIndicator;
