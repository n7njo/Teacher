import React, { useState } from "react";

interface FeedbackData {
  lessonId: string;
  rating: number;
  difficulty: number;
  clarity: number;
  engagement: number;
  comments: string;
  timeSpent: number;
  userId?: string;
}

interface FeedbackSystemProps {
  lessonId: string;
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
  className?: string;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({
  lessonId,
  onFeedbackSubmit,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    difficulty: 0,
    clarity: 0,
    engagement: 0,
    comments: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feedbackData: FeedbackData = {
      lessonId,
      timeSpent: performance.now(), // Simple time tracking
      userId: localStorage.getItem("userId") || undefined,
      ...feedback,
    };

    // Send feedback to analytics system
    if (onFeedbackSubmit) {
      onFeedbackSubmit(feedbackData);
    }

    // Send to API
    fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    }).catch((error) => {
      console.error("Failed to submit feedback:", error);
    });

    setSubmitted(true);
    setTimeout(() => setIsOpen(false), 2000);
  };

  const StarRating: React.FC<{
    value: number;
    onChange: (value: number) => void;
    label: string;
  }> = ({ value, onChange, label }) => (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              color: star <= value ? "#ffd700" : "#ddd",
              cursor: "pointer",
              padding: "2px",
            }}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={className}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "50px",
          padding: "12px 20px",
          cursor: "pointer",
          fontSize: "14px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        📝 Give Feedback
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        minWidth: "300px",
        maxWidth: "400px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}
    >
      {submitted ? (
        <div style={{ textAlign: "center", color: "#28a745" }}>
          <h3>Thank you for your feedback!</h3>
          <p>Your input helps us improve the learning experience.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ margin: 0 }}>Lesson Feedback</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#666",
              }}
            >
              ×
            </button>
          </div>

          <StarRating
            value={feedback.rating}
            onChange={(value) =>
              setFeedback((prev) => ({ ...prev, rating: value }))
            }
            label="Overall Rating"
          />

          <StarRating
            value={feedback.difficulty}
            onChange={(value) =>
              setFeedback((prev) => ({ ...prev, difficulty: value }))
            }
            label="Difficulty Level (1=Too Easy, 5=Too Hard)"
          />

          <StarRating
            value={feedback.clarity}
            onChange={(value) =>
              setFeedback((prev) => ({ ...prev, clarity: value }))
            }
            label="Content Clarity"
          />

          <StarRating
            value={feedback.engagement}
            onChange={(value) =>
              setFeedback((prev) => ({ ...prev, engagement: value }))
            }
            label="Engagement Level"
          />

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Additional Comments
            </label>
            <textarea
              value={feedback.comments}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, comments: e.target.value }))
              }
              placeholder="Tell us how we can improve this lesson..."
              style={{
                width: "100%",
                height: "80px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "10px 20px",
                cursor: "pointer",
                flex: 1,
              }}
            >
              Submit Feedback
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FeedbackSystem;
