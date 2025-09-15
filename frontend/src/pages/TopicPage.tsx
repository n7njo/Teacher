import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

interface Lesson {
  id: string;
  name: string;
  description: string;
  slug: string;
  estimated_duration_minutes: number;
  lesson_type: string;
  order_index: number;
}

const TopicPage: React.FC = () => {
  const { categorySlug, topicSlug } = useParams<{
    categorySlug: string;
    topicSlug: string;
  }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topicId, setTopicId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopicAndLessons = async () => {
      if (!categorySlug || !topicSlug) return;

      try {
        // First get the topic to find its ID
        const topicsResponse = await axios.get(
          `/api/categories/${categorySlug}/topics`,
        );
        const topic = topicsResponse.data.find(
          (t: any) => t.slug === topicSlug,
        );

        if (!topic) {
          setError("Topic not found");
          return;
        }

        setTopicId(topic.id);

        // Then get lessons for this topic
        const lessonsResponse = await axios.get(
          `/api/topics/${topic.id}/lessons`,
        );
        setLessons(lessonsResponse.data);
      } catch (err) {
        setError("Failed to load lessons. Please try again later.");
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndLessons();
  }, [categorySlug, topicSlug]);

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "reading":
        return "📖";
      case "video":
        return "🎥";
      case "interactive":
        return "💻";
      case "quiz":
        return "❓";
      case "exercise":
        return "✏️";
      default:
        return "📄";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return <div className="loading">Loading lessons...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={`/category/${categorySlug}`}>{categorySlug}</Link>
        <span>›</span>
        <span>{topicSlug}</span>
      </div>

      <h1
        style={{
          color: "white",
          marginBottom: "2rem",
          textTransform: "capitalize",
        }}
      >
        {topicSlug?.replace("-", " ")} Lessons
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            to={`/lesson/${lesson.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              className="card"
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <div
                style={{
                  minWidth: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>
                    {getLessonTypeIcon(lesson.lesson_type)}
                  </span>
                  <h3 style={{ margin: 0, color: "white" }}>{lesson.name}</h3>
                </div>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)" }}>
                  {lesson.description}
                </p>
              </div>
              <div
                style={{
                  textAlign: "right",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <div
                  style={{ fontSize: "0.9rem", textTransform: "capitalize" }}
                >
                  {lesson.lesson_type}
                </div>
                <div style={{ fontSize: "0.8rem" }}>
                  {formatDuration(lesson.estimated_duration_minutes)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {lessons.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            No lessons available yet
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Check back soon for new lessons in this topic!
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicPage;
