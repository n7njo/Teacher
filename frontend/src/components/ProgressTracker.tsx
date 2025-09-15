import React from "react";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  showPercentage?: boolean;
  size?: "small" | "medium" | "large";
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  totalSteps,
  stepLabels = [],
  showPercentage = true,
  size = "medium",
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  const getSizeStyles = () => {
    const sizes = {
      small: { height: "4px", fontSize: "0.8rem", padding: "0.5rem" },
      medium: { height: "8px", fontSize: "0.9rem", padding: "1rem" },
      large: { height: "12px", fontSize: "1rem", padding: "1.5rem" },
    };
    return sizes[size];
  };

  const sizeStyles = getSizeStyles();

  return (
    <div
      className="progress-tracker glass-card"
      style={{
        background: "var(--glass-bg)",
        padding: sizeStyles.padding,
        borderRadius: "12px",
        border: "1px solid var(--glass-border)",
        marginBottom: "1rem",
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
        <span
          style={{
            fontSize: sizeStyles.fontSize,
            fontWeight: "600",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          📊 Progress
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {showPercentage && (
            <span
              style={{
                fontSize: sizeStyles.fontSize,
                color: "var(--text-muted)",
                fontWeight: "500",
              }}
            >
              {percentage}%
            </span>
          )}
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              background: "var(--glass-bg-hover)",
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: sizeStyles.height,
          background: "var(--glass-bg-hover)",
          borderRadius: sizeStyles.height,
          overflow: "hidden",
          marginBottom: stepLabels.length > 0 ? "1rem" : "0",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "var(--gradient-accent)",
            borderRadius: sizeStyles.height,
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
          }}
        >
          {/* Animated shine effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              animation:
                percentage > 0 ? "shine 2s ease-in-out infinite" : "none",
            }}
          />
        </div>
      </div>

      {/* Step Labels */}
      {stepLabels.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.75rem",
          }}
        >
          {stepLabels.slice(0, totalSteps).map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.8rem",
                  color: isCompleted
                    ? "var(--primary-green)"
                    : "var(--text-muted)",
                  fontWeight: isCurrent ? "600" : "400",
                  opacity: isCompleted ? 1 : 0.7,
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: isCompleted
                      ? "var(--primary-green)"
                      : "var(--glass-bg-hover)",
                    border: isCurrent
                      ? "2px solid var(--primary-green)"
                      : "1px solid var(--glass-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: isCompleted ? "white" : "var(--text-muted)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          @keyframes shine {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default ProgressTracker;
